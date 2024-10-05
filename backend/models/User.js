const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Consultant", "Project Manager", "Director"),
      allowNull: false,
      defaultValue: "Consultant",
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true, // Refresh token can be null until login
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
  }
);
User.associate = (models) => {
  User.hasMany(models.Task, {
    foreignKey: "assigned_to_user_id",
    as: "assignedTasks",
  });
};

module.exports = User;
