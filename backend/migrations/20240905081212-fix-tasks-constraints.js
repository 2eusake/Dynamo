'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeConstraint('tasks', 'tasks_ibfk_1');
    await queryInterface.removeConstraint('tasks', 'tasks_ibfk_2');
    
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
  }
};