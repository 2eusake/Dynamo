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
    wbs_element: {
      type: DataTypes.CHAR(225),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "not Started",
        "in Progress",
        "on Hold",
        "completed"
      ),
      allowNull: false,
      defaultValue: "not started",
    },
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    projectManagerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "project_manager_id", // Match the column name in the database
      references: {
        model: "users", // Foreign key to the users table for project manager
        key: "id",
      },
      onDelete: "SET NULL", // Same as in your SQL schema
      onUpdate: "CASCADE",
    },
    director_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "director_id", // Match the column name in the database
      references: {
        model: "users", // Foreign key to the users table for project manager
        key: "id",
      },
      onDelete: "SET NULL", // Same as in your SQL schema
      onUpdate: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    underscored: true, // Ensure that Sequelize converts camelCase to snake_case
  }
);

module.exports = Project;
