import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { UserCircle } from 'lucide-react'; 
import 'react-toastify/dist/ReactToastify.css';
import { TaskContext } from '../../contexts/TaskContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../UIComp';
import './TasksPage.css';  
import { useTheme } from '../../contexts/ThemeContext';

const TasksPage = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);
  const [notificationShown, setNotificationShown] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchTasks();
        if (!notificationShown) {
          toast.success('Tasks fetched successfully!');
          setNotificationShown(true);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks.');
      }
    };

    loadTasks();
  }, [fetchTasks, notificationShown]);

  const groupedTasks = tasks.reduce((acc, task) => {
    const projectId = task.project_id || 'Unassigned';
    if (!acc[projectId]) {
      acc[projectId] = { project_id: projectId, tasks: [] };
    }
    acc[projectId].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="layout">
      {/* Sidebar goes here */}
      <div className="sidebar">
        {/* Sidebar content */}
      </div>

      <div className="content">
        {/* Navbar goes here */}
        <div className="navbar">
          {/* Navbar content */}
        </div>

        {/* Main content starts here */}
        <div className={`mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        
          <h1 className="text-3xl font-bold mb-6">Tasks</h1>
          <ToastContainer />
          {Object.keys(groupedTasks).length > 0 ? (
            Object.values(groupedTasks).map((projectGroup) => {
              return (
                <Card key={projectGroup.project_id} className="mb-6">
                 
                  <CardHeader>
                 
                    <CardTitle>
                    <div
                    className={` p-4 cursor-pointer bg-black shadow-sm 4  ${isDarkMode ? 'bg-gray-800  text-white' : 'bg-white text-black'}`}>
                    Project ID: {projectGroup.project_id }</div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  
                    {projectGroup.tasks.length > 0 ? (
                      projectGroup.tasks.map((task) => (
                        <div key={task.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{task.taskName || 'Unnamed Task'}</h3>
                            <h3 className="text-lg font-semibold">{task.taskId || 'Unnamed Task'}</h3>
                            <span
                              className={`px-2 py-1 rounded text-sm ${task.status === 'Completed'
                                  ? 'bg-green-200 text-green-800'
                                  : task.status === 'In Progress'
                                    ? 'bg-yellow-200 text-yellow-800'
                                    : 'bg-gray-200 text-gray-800'}`}
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
                      <p>No tasks available for this project.</p>
                    )}
                    
                  </CardContent>
                 
                </Card>
                
              );
            })
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </div>
      </div> 
    
    
  );
};

export default TasksPage;

