const { User, Task, Project } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

const reportController = {
  async getConsultantPerformance(req, res) {
    try {
      const consultants = await User.findAll({
        where: { role: "Consultant" },
        attributes: ["id", "username"],
        include: [
          {
            model: Task,
            as: "assignedTasks",
            attributes: [
              [
                sequelize.fn("COUNT", sequelize.col("assignedTasks.id")),
                "totalTasks",
              ],
              [
                sequelize.fn("SUM", sequelize.col("assignedTasks.hours")),
                "totalHoursAllocated",
              ],
              [
                sequelize.fn("SUM", sequelize.col("assignedTasks.actualHours")),
                "totalActualHours",
              ],
              [
                sequelize.fn(
                  "AVG",
                  sequelize.literal(
                    'CASE WHEN assignedTasks.status = "completed" THEN 1 ELSE 0 END'
                  )
                ),
                "completionRate",
              ],
            ],
            group: ["assignedTasks.assigned_to_user_id"],
          },
        ],
      });

      const consultantStats = await Promise.all(
        consultants.map(async (consultant) => {
          const tasksByMonth = await Task.findAll({
            where: {
              assigned_to_user_id: consultant.id,
              createdAt: {
                [Op.gte]: new Date(
                  new Date().setMonth(new Date().getMonth() - 6)
                ),
              },
            },
            attributes: [
              [
                sequelize.fn(
                  "DATE_FORMAT",
                  sequelize.col("created_at"),
                  "%Y-%m"
                ),
                "month",
              ],
              [sequelize.fn("COUNT", sequelize.col("id")), "count"],
              [
                sequelize.fn(
                  "SUM",
                  sequelize.literal(
                    'CASE WHEN status = "completed" THEN 1 ELSE 0 END'
                  )
                ),
                "completed",
              ],
            ],
            group: [
              sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y-%m"),
            ],
          });

          return {
            id: consultant.id,
            username: consultant.username,
            performanceMetrics: consultant.assignedTasks[0] || {
              totalTasks: 0,
              totalHoursAllocated: 0,
              totalActualHours: 0,
              completionRate: 0,
            },
            monthlyPerformance: tasksByMonth,
          };
        })
      );

      res.json(consultantStats);
    } catch (error) {
      console.error("Error fetching consultant performance:", error);
      res
        .status(500)
        .json({ message: "Error fetching consultant performance data" });
    }
  },
};

module.exports = reportController;
