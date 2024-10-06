// import React, { useContext, useEffect, useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { TaskContext } from '../../contexts/TaskContext';
// import { Link } from 'react-router-dom';
// import { Card, CardHeader, CardTitle, CardContent, Button } from './UIComp';

// const TasksPage = () => {
//   const { tasks, fetchTasks } = useContext(TaskContext);
//   const [notificationShown, setNotificationShown] = useState(false);

//   useEffect(() => {
//     const loadTasks = async () => {
//       try {
//         await fetchTasks();
//         if (!notificationShown) {
//           toast.success('Tasks fetched successfully!');
//           setNotificationShown(true);
//         }
//       } catch (error) {
//         console.error('Error fetching tasks:', error);
//         toast.error('Failed to fetch tasks.');
//       }
//     };

//     loadTasks();
//   }, [fetchTasks, notificationShown]);

//   const groupedTasks = tasks.reduce((acc, task) => {
//     const projectId = task.project_id || 'Unassigned';
//     if (!acc[projectId]) {
//       acc[projectId] = { project_id: projectId, tasks: [] };
//     }
//     acc[projectId].tasks.push(task);
//     return acc;
//   }, {});

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Tasks</h1>
//       <ToastContainer />
//       {Object.keys(groupedTasks).length > 0 ? (
//         Object.values(groupedTasks).map((projectGroup) => (
//           <Card key={projectGroup.project_id} className="mb-6">
//             <CardHeader>
//               <CardTitle>Project ID: {projectGroup.project_id}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {projectGroup.tasks.length > 0 ? (
//                 projectGroup.tasks.map((task) => (
//                   <div key={task.id} className="mb-4 p-4 bg-white rounded-lg shadow">
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold">{task.taskName || 'Unnamed Task'}</h3>
//                       <h3 className="text-lg font-semibold">{task.taskId || 'Unnamed Task'}</h3>
//                       <span className={`px-2 py-1 rounded text-sm ${
//                         task.status === 'Completed' ? 'bg-green-200 text-green-800' :
//                         task.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
//                         'bg-gray-200 text-gray-800'
//                       }`}>
//                         {task.status || 'Unknown'}
//                       </span>
//                     </div>
//                     <p className="text-gray-600 mt-2">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
//                     {task.id ? (
//                       <Link to={`/tasks/${task.id}`}>
//                         <Button variant="outline" className="mt-2">View Details</Button>
//                       </Link>
//                     ) : (
//                       <Button variant="outline" className="mt-2" disabled>Details Unavailable</Button>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p>No tasks available for this project.</p>
//               )}
//             </CardContent>
//           </Card>
//         ))
//       ) : (
//         <p>No tasks available.</p>
//       )}
//     </div>
//   );
// };

// export default TasksPage;
// (03/10/2024)
import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskContext } from '../../contexts/TaskContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from './UIComp';
import './TasksPage.css';  // Import your new CSS file for layout
import { useTheme } from '../../contexts/ThemeContext'; // Import the theme context

const TasksPage = () => {
  const { tasks, fetchTasks } = useContext(TaskContext);
  const [notificationShown, setNotificationShown] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use the context

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
// import React, { useContext, useEffect, useState } from 'react';
// import { TaskContext } from '../../contexts/TaskContext';
// import { Card, CardHeader, CardTitle, CardContent, Button } from './UIComp';
// import { PlusCircle, Filter, ArrowUpDown } from 'lucide-react';
// import './TasksPage.css';

// const TasksPage = () => {
//   const { tasks, fetchTasks } = useContext(TaskContext);
//   const [columns, setColumns] = useState({
//     'To do': [],
//     'In Progress': [],
//     'At Risk': [],
//     'Done': []
//   });

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   useEffect(() => {
//     const groupedTasks = tasks.reduce((acc, task) => {
//       const status = task.status || 'To do';
//       if (!acc[status]) {
//         acc[status] = [];
//       }
//       acc[status].push(task);
//       return acc;
//     }, {});
//     setColumns(prevColumns => ({
//       ...prevColumns,
//       ...groupedTasks
//     }));
//   }, [tasks]);

//   const renderTask = (task) => (
//     <Card key={task.id} className="mb-2 p-3">
//       <CardContent>
//         <h3 className="text-sm font-semibold">{task.taskName || 'Unnamed Task'}</h3>
//         <div className="flex flex-wrap gap-1 mt-2">
//           {task.tags && task.tags.map(tag => (
//             <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">{tag}</span>
//           ))}
//         </div>
//         <div className="flex items-center justify-between mt-2">
//           <div className="flex -space-x-2">
//             {task.assignees && task.assignees.map((assignee, index) => (
//               <div key={index} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600">
//                 {assignee.charAt(0).toUpperCase()}
//               </div>
//             ))}
//           </div>
//           <span className="text-xs text-gray-500">{task.due_date}</span>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className="flex h-screen bg-gray-100">
     

//       <main className="flex-1 p-8">
//         <header className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Tasks</h2>
//           <div className="flex items-center space-x-4">
//             <Button variant="outline" className="flex items-center">
//               <ArrowUpDown className="mr-2 h-4 w-4" /> Sort by
//             </Button>
//             <Button variant="outline" className="flex items-center">
//               <Filter className="mr-2 h-4 w-4" /> Filter
//             </Button>
//           </div>
//         </header>

//         <div className="grid grid-cols-4 gap-4">
//           {Object.entries(columns).map(([status, tasks]) => (
//             <div key={status} className="bg-gray-100 p-4 rounded-lg">
//               <h3 className="font-semibold mb-4">{status} <span className="text-gray-500">({tasks.length})</span></h3>
//               {tasks.map(renderTask)}
              
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default TasksPage;
