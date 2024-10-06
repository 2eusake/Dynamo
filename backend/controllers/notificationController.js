const { User, Project, Task, Notification } = require("../models");
const { Op } = require("sequelize");

const generateNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const notifications = [];
    const today = new Date();

    // Project notifications for Project Managers and Directors
    if (user.role === "Project Manager" || user.role === "Director") {
      const projects = await Project.findAll({
        where: {
          [Op.or]: [{ projectManagerId: userId }, { directorId: userId }],
        },
      });

      projects.forEach((project) => {
        if (project.startDate && daysUntil(project.startDate) === 1) {
          notifications.push({
            userId,
            type: "info",
            message: `Project "${project.name}" is starting tomorrow.`,
          });
        }

        if (project.endDate && daysUntil(project.endDate) === 7) {
          notifications.push({
            userId,
            type: "warning",
            message: `Project "${project.name}" is due in a week.`,
          });
        }

        if (
          project.endDate &&
          project.endDate < today &&
          project.status !== "completed"
        ) {
          notifications.push({
            userId,
            type: "error",
            message: `Project "${project.name}" is overdue.`,
          });
        }
      });
    }

    // Task notifications
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { assigned_to_user_id: userId },
          { "$Project.projectManagerId$": userId },
        ],
      },
      include: [{ model: Project }],
    });

    tasks.forEach((task) => {
      // Task assigned notification for consultants
      if (task.assigned_to_user_id && task.assigned_to_user_id === userId) {
        notifications.push({
          userId: task.assigned_to_user_id, // Consultant's userId
          type: "info",
          message: `You have been assigned the task "${task.taskName}" in project "${task.Project.name}".`,
        });
      }

      if (task.start_date && daysUntil(task.start_date) === 0) {
        notifications.push({
          userId,
          type: "info",
          message: `Task "${task.taskName}" is starting today.`,
        });
      }

      if (task.due_date && daysUntil(task.due_date) === 2) {
        notifications.push({
          userId,
          type: "warning",
          message: `Task "${task.taskName}" is due in 2 days.`,
        });
      }

      if (
        task.due_date &&
        task.due_date < today &&
        task.status !== "completed"
      ) {
        notifications.push({
          userId,
          type: "error",
          message: `Task "${task.taskName}" is overdue.`,
        });
      }

      if (task.actualHours > task.hours) {
        notifications.push({
          userId,
          type: "warning",
          message: `Task "${task.taskName}" is exceeding allocated hours.`,
        });
      }
    });

    // Save notifications to the database
    await Notification.bulkCreate(notifications);

    res.json(notifications);
  } catch (error) {
    console.error("Error generating notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.destroy();

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const daysUntil = (date) => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = {
  generateNotifications,
  markAsRead,
  deleteNotification,
  getAllNotifications,
};
