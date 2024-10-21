'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Attempt to remove constraints, ignore if they don't exist
    await queryInterface.removeConstraint('tasks', 'tasks_ibfk_1').catch(() => {});
    await queryInterface.removeConstraint('tasks', 'tasks_ibfk_2').catch(() => {});
    
    await queryInterface.removeConstraint('tasks', 'fk_task_user').catch(() => {});
    await queryInterface.removeConstraint('tasks', 'fk_task_project').catch(() => {});

    // Add new constraints
    await queryInterface.addConstraint('tasks', {
      fields: ['assigned_to_user_id'],
      type: 'foreign key',
      name: 'fk_task_user',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('tasks', {
      fields: ['project_id'],
      type: 'foreign key',
      name: 'fk_task_project',
      references: {
        table: 'projects',
        field: 'id',
      },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Optionally revert the constraints if needed
    await queryInterface.removeConstraint('tasks', 'fk_task_user').catch(() => {});
    await queryInterface.removeConstraint('tasks', 'fk_task_project').catch(() => {});
  }
};
