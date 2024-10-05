class NotificationService {
  static async generateNotifications(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
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

      for (const project of projects) {
        if (project.startDate && this.daysUntil(project.startDate) === 1) {
          notifications.push({
            type: "info",
            message: `Project "${project.name}" is starting tomorrow.`,
          });
        }

        if (project.endDate && this.daysUntil(project.endDate) === 7) {
          notifications.push({
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
            type: "error",
            message: `Project "${project.name}" is overdue.`,
          });
        }
      }
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

    for (const task of tasks) {
      if (task.start_date && this.daysUntil(task.start_date) === 0) {
        notifications.push({
          type: "info",
          message: `Task "${task.taskName}" is starting today.`,
        });
      }

      if (task.due_date && this.daysUntil(task.due_date) === 2) {
        notifications.push({
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
          type: "error",
          message: `Task "${task.taskName}" is overdue.`,
        });
      }

      if (task.actualHours > task.hours) {
        notifications.push({
          type: "warning",
          message: `Task "${task.taskName}" is exceeding allocated hours.`,
        });
      }
    }

    return notifications;
  }

  static daysUntil(date) {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
