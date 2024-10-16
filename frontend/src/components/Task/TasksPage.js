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
import apiClient from '../../utils/apiClient'; // Ensure apiClient is imported

const TasksPage = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);
  const [notificationShown, setNotificationShown] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  // State to hold projects data
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadTasksAndProjects = async () => {
      try {
        await fetchTasks();
        if (!notificationShown) {
          toast.success('Tasks fetched successfully!');
          setNotificationShown(true);
        }
        // Fetch projects
        const projectsResponse = await apiClient.get('/projects'); // Adjust endpoint as needed
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching tasks or projects:', error);
        toast.error('Failed to fetch tasks or projects.');
      }
    };

    loadTasksAndProjects();
  }, [fetchTasks, notificationShown]);

  // Create a mapping from project_id to wbsElement
  const projectIdToWbsElement = projects.reduce((acc, project) => {
    acc[project.id] = project.wbsElement;
    return acc;
  }, {});

  // Group tasks by WBS Element
  const groupedTasks = tasks.reduce((acc, task) => {
    const projectId = task.project_id || 'Unassigned';
    const wbsElement = projectIdToWbsElement[projectId] || 'Unassigned';
    if (!acc[wbsElement]) {
      acc[wbsElement] = { wbsElement, tasks: [] };
    }
    acc[wbsElement].tasks.push(task);
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
        <div className={`mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h1 className={`text-3xl font-bold mb-6  underline-green ${isDarkMode ? ' text-white' : ' text-black'}`}>Tasks</h1>
          <ToastContainer />
          
          {Object.keys(groupedTasks).length > 0 ? (
            Object.values(groupedTasks).map((wbsGroup) => (
              <Card key={wbsGroup.wbsElement} className="mb-6">
                <CardHeader>
                  <CardTitle>
                    <div
                      className={`p-4 cursor-pointer ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'} shadow-sm rounded`}
                    >
                      WBS Element: {wbsGroup.wbsElement}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wbsGroup.tasks.length > 0 ? (
                    wbsGroup.tasks.map((task) => (
                      <div key={task.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center">
                          <h3 className={`text-lg font-semibold ${isDarkMode ? ' text-white' : ' text-black'}`}>{task.taskName || 'Unnamed Task'}</h3>
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
                        <p className="text-gray-600 mt-2">
                          <UserCircle className="inline-block mr-1" size={16} />
                          Assigned to: {task.assignedToUser ? task.assignedToUser.username : 'Unassigned'}
                        </p>
                        <p className="text-gray-600 mt-2">
                          Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                        </p>
                        {task.id ? (
                          <Link to={`/tasks/${task.id}`}>
                            <Button variant="outline" className="mt-2">
                              View Details
                            </Button>
                          </Link>
                        ) : (
                          <Button variant="outline" className="mt-2" disabled>
                            Details Unavailable
                          </Button>
                        )}
                      </div>
                    ))
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
