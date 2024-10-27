// src/components/Task/TasksPage.js

import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { UserCircle } from 'lucide-react'; 
import 'react-toastify/dist/ReactToastify.css';
import { TaskContext } from '../../contexts/TaskContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../UIComp';
import './TasksPage.css';  
import { useTheme } from '../../contexts/ThemeContext';
import apiClient from '../../utils/apiClient';

const TasksPage = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);
  const [notificationShown, setNotificationShown] = useState(false);
  const { isDarkMode } = useTheme();

  // State to hold projects data
  const [projects, setProjects] = useState([]);

  // Add sortOrder state
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Add taskFilter state
  const [taskFilter, setTaskFilter] = useState('');

  useEffect(() => {
    const loadTasksAndProjects = async () => {
      try {
        await fetchTasks();
        if (!notificationShown) {
          toast.success('Tasks fetched successfully!');
          setNotificationShown(true);
        }
        // Fetch projects
        const projectsResponse = await apiClient.get('/projects');
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching tasks or projects:', error);
        toast.error('Failed to fetch tasks or projects.');
      }
    };

    loadTasksAndProjects();
  }, [fetchTasks, notificationShown]);

  // Create a mapping from project_id to wbsElement and project name
  const projectIdToWbsElement = projects.reduce((acc, project) => {
    acc[project.id] = project.wbsElement;
    return acc;
  }, {});

  const projectIdToProjectName = projects.reduce((acc, project) => {
    acc[project.id] = project.name;
    return acc;
  }, {});

  // Group tasks by WBS Element
  const groupedTasks = tasks.reduce((acc, task) => {
    const projectId = task.project_id || 'Unassigned';
    const wbsElement = projectIdToWbsElement[projectId] || 'Unassigned';
    const projectName = projectIdToProjectName[projectId] || 'Unnamed Project';
    const groupKey = `${projectName}-${wbsElement}`; // Unique key for grouping

    if (!acc[groupKey]) {
      acc[groupKey] = { wbsElement, projectName, tasks: [] };
    }
    acc[groupKey].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar content */}
      </div>

      <div className="content">
        {/* Navbar */}
        <div className="navbar">
          {/* Navbar content */}
        </div>

        {/* Main Content */}
        <div className={`mx-auto p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
          <h1 className={`text-3xl font-bold mb-6 underline-green ${isDarkMode ? 'text-white' : 'text-black'}`}>Tasks</h1>
          <ToastContainer />
          
          {/* Add Sort Order Select */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="mb-2 md:mb-0">
              <label htmlFor="sortOrder" className="mr-2">Sort Tasks By Name:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`p-2 rounded border ${
                  isDarkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300 text-black"
                }`}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* Add Task Name Filter */}
            <div>
              <label htmlFor="taskFilter" className="mr-2">Filter Tasks By Name:</label>
              <input
                id="taskFilter"
                type="text"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                className={`p-2 rounded border ${
                  isDarkMode ? "bg-gray-700 border-gray-500 text-white" : "bg-white border-gray-300 text-black"
                }`}
                placeholder="Enter task name keyword"
              />
            </div>
          </div>

          {Object.keys(groupedTasks).length > 0 ? (
            Object.values(groupedTasks).map((wbsGroup, index) => (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <CardTitle>
                    <div className={`flex flex-col md:flex-row md:justify-between items-start md:items-center`}>
                      <div
                        className={`p-4 mb-2 md:mb-0 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} shadow-sm rounded`}
                      >
                        <strong>Project Name:</strong> {wbsGroup.projectName}
                      </div>
                      <div
                        className={`p-4 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} shadow-sm rounded`}
                      >
                        <strong>WBS Element:</strong> {wbsGroup.wbsElement}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wbsGroup.tasks.length > 0 ? (
                    (() => {
                      // Filter tasks based on taskFilter
                      const filteredTasks = wbsGroup.tasks.filter((task) => {
                        if (taskFilter === '') {
                          return true;
                        }
                        const taskName = task.taskName || '';
                        return taskName.toLowerCase().includes(taskFilter.toLowerCase());
                      });

                      if (filteredTasks.length === 0) {
                        return <p>No tasks match the filter criteria.</p>;
                      }

                      const sortedTasks = filteredTasks.sort((a, b) => {
                        const nameA = a.taskName || '';
                        const nameB = b.taskName || '';
                        if (sortOrder === 'asc') {
                          return nameA.localeCompare(nameB);
                        } else {
                          return nameB.localeCompare(nameA);
                        }
                      });

                      return sortedTasks.map((task) => {
                        // Calculate progress percentage
                        const progress = task.actualHours && task.hours
                          ? Math.min(100, Math.round((task.actualHours / task.hours) * 100))
                          : 0;

                        // Calculate days until due date
                        const daysUntilDue = task.due_date
                          ? Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24))
                          : null;

                        return (
                          <div
                            key={task.id}
                            className={`mb-4 p-4 rounded-lg shadow ${
                              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
                            } ${
                              daysUntilDue < 0 ? 'border border-red-500' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <h3 className={`text-xl font-semibold`}>
                                {task.taskName || 'Unnamed Task'}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-sm ${
                                  task.status === 'Completed'
                                    ? 'bg-green-200 text-green-800'
                                    : task.status === 'In Progress'
                                    ? 'bg-yellow-200 text-yellow-800'
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                              >
                                {task.status || 'Unknown'}
                              </span>
                            </div>
                            <p className="mt-2 flex items-center">
                              <UserCircle className="inline-block mr-1" size={16} />
                              Assigned to: {task.assignedToUser ? task.assignedToUser.username : 'Unassigned'}
                            </p>
                            <p className="mt-2">
                              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                            </p>
                            {/* Allocated Hours */}
                            <p className="mt-2">
                              Allocated Hours: {task.hours || 'N/A'}
                            </p>

                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="w-full bg-gray-300 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    progress < 50 ? 'bg-red-500' : progress < 75 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">
                                {progress}% Complete
                              </span>
                            </div>

                            {/* Days Until Due Date */}
                            {daysUntilDue !== null && (
                              <div className="text-sm mt-2">
                                {daysUntilDue > 0
                                  ? `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} left until due date`
                                  : daysUntilDue === 0
                                  ? 'Due today!'
                                  : `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`}
                              </div>
                            )}

                            {/* Warning for Overdue Tasks */}
                            {daysUntilDue < 0 && (
                              <div className="text-red-500 text-sm italic">
                                This task is overdue!
                              </div>
                            )}

                            {/* Warning if Actual Hours Exceed Allocated Hours */}
                            {task.actualHours > task.hours && (
                              <div className="text-red-500 text-sm italic">
                                Warning: Actual hours exceed allocated hours!
                              </div>
                            )}

                            {task.id ? (
                              <Link to={`/tasks/${task.id}`}>
                                <Button variant="outline" className="mt-4">
                                  View Details
                                </Button>
                              </Link>
                            ) : (
                              <Button variant="outline" className="mt-4" disabled>
                                Details Unavailable
                              </Button>
                            )}
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <p>No tasks available for this WBS Element.</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
