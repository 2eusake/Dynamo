const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wbsElement: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      field: "wbs_element",
    },
    startDate: {
      type: DataTypes.DATE,
      field: "start_date",
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      field: "end_date",
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("not started", "in progress", "completed"),
      allowNull: false,
      defaultValue: "not started",
    },
    projectManagerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "project_manager_id",
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    directorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "director_id",
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "Projects",
  }
);
Project.associate = (models) => {
  Project.hasMany(models.Task, { foreignKey: "projectId", as: "tasks" });
};
module.exports = Project;
