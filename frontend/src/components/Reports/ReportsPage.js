
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import apiClient from '../../utils/apiClient';
// import { Card, CardHeader, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../UIComponents';  // Adjust path as needed

// const ReportsPage = () => {
//   const [reportData, setReportData] = useState({
//     stats: {
//       totalProjects: 0,
//       activeProjects: 0,
//       completedTasks: 0,
//       overdueTasks: 0,
//     },
//     projects: [],
//     progressData: [],
//   });
//   const [notification, setNotification] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log('Fetching report data...');
//         const response = await apiClient.get('/reports/data');
//         console.log('API Response:', response.data);
//         setReportData(response.data);
//       } catch (error) {
//         console.error('Error fetching reports data:', error);
//         console.error('Error response:', error.response);
//         setNotification('Failed to fetch reports data. ' + (error.response?.data?.message || error.message));
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     console.log('Current reportData state:', reportData);
//   }, [reportData]);

//   const { stats, projects, progressData } = reportData;

//   if (!stats || !projects || !progressData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">Reports Dashboard</h1>
//       {notification && (
//         <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{notification}</span>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <Card className="bg-gradient-to-r from-blue-400 to-indigo-500">
//           <CardHeader>
//             <h3 className="text-lg font-bold text-white">Total Projects</h3>
//           </CardHeader>
//           <CardContent>
//             <p className="text-4xl font-bold text-white">{stats.totalProjects}</p>
//           </CardContent>
//         </Card>
//         <Card className="bg-gradient-to-r from-green-400 to-teal-500">
//           <CardHeader>
//             <h3 className="text-lg font-bold text-white">Active Projects</h3>
//           </CardHeader>
//           <CardContent>
//             <p className="text-4xl font-bold text-white">{stats.activeProjects}</p>
//           </CardContent>
//         </Card>
//         <Card className="bg-gradient-to-r from-purple-400 to-pink-500">
//           <CardHeader>
//             <h3 className="text-lg font-bold text-white">Completed Tasks</h3>
//           </CardHeader>
//           <CardContent>
//             <p className="text-4xl font-bold text-white">{stats.completedTasks}</p>
//           </CardContent>
//         </Card>
//         <Card className="bg-gradient-to-r from-red-400 to-orange-500">
//           <CardHeader>
//             <h3 className="text-lg font-bold text-white">Overdue Tasks</h3>
//           </CardHeader>
//           <CardContent>
//             <p className="text-4xl font-bold text-white">{stats.overdueTasks}</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Line Chart for Project Progress */}
//       {progressData.length > 0 && (
//         <Card className="bg-white shadow rounded-lg p-6 mb-8">
//           <CardHeader>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Progress Over Time</h2>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={progressData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       )}

//       <h2 className="text-3xl font-bold mb-6 text-gray-800">Project Reports</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {projects.length > 0 ? (
//           projects.map(project => (
//             <Card key={project.id} className="bg-white shadow rounded-lg p-4">
//               <Link to={`/projects/${project.id}`} className="block">
//                 <CardHeader>
//                   <h3 className="text-xl font-semibold">{project.name}</h3>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600 mb-3">{project.wbsElement || 'No WBS Element'}</p>
//                   <div className="bg-gray-200 rounded-full h-2.5 mb-3">
//                     <div 
//                       className="bg-blue-600 h-2.5 rounded-full" 
//                       style={{ width: `${project.progress || 0}%` }}
//                     />
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <p className="text-sm text-gray-500">Progress: {project.progress || 0}%</p>
//                     <p className="text-sm text-gray-500">Status: {project.status}</p>
//                   </div>
//                 </CardContent>
//               </Link>
//             </Card>
//           ))
//         ) : (
//           <p className="col-span-full text-center text-gray-500">No projects available.</p>
//         )}
//       </div>

//       <h2 className="text-3xl font-bold mb-6 text-gray-800">Task Reports</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {projects.flatMap(project => project.tasks || []).length > 0 ? (
//           projects.flatMap(project => 
//             (project.tasks || []).map(task => (
//               <Card key={task.id} className="bg-white shadow rounded-lg p-4">
//                 <Link to={`/tasks/${task.id}`} className="block">
//                   <CardHeader>
//                     <h3 className="text-xl font-semibold">{task.taskName}</h3>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-600 mb-1">Assigned To: {task.assignedToUserId ? 'Assigned' : 'Unassigned'}</p>
//                     <p className="text-gray-600 mb-1">Status: {task.status}</p>
//                     <p className="text-gray-600">Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
//                   </CardContent>
//                 </Link>
//               </Card>
//             ))
//           )
//         ) : (
//           <p className="col-span-full text-center text-gray-500">No tasks available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReportsPage;

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import apiClient from '../../utils/apiClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, PieChart as PieChartIcon, TrendingUp, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./UIComponents";
import { Alert, AlertDescription} from "./UIComponents";
import { Button } from "./UIComponents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./UIComponents";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  const [projects, setProjects] = useState([]); // Add missing state
  const [tasks, setTasks] = useState([]); // Add missing state
  const [notifications, setNotifications] = useState([]); // Add missing state
  const [events, setEvents] = useState([]); // Add missing state

  const [reportData] = useState({
    projectCompletion: [],
    taskDistribution: [],
    timeTracking: []
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const handleLogout = () => {
    // Your logout logic here
    console.log('Logging out...');
  };

  // useEffect(() => {
  //   const fetchReportData = async () => {
  //     try {
  //       setLoading(true);
  //       // In a real application, you would fetch this data from your API
  //       const response = await apiClient.get(`/reports?timeframe=${selectedTimeframe}`);
  //       setReportData(response.data);
  //     } catch (err) {
  //       setError('Failed to fetch report data. Please try again later.');
  //       console.error('Error fetching report data:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchReportData();
  // }, [selectedTimeframe]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, tasksResponse] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/tasks'),
        ]);

        setProjects(projectsResponse.data);
        setTasks(tasksResponse.data);
        setUser(user);
        setNotifications([
          "User X completed task Y.",
          "User Z updated project A.",
          "New task assigned to you.",
        ]);

        // Initialize events from projects and tasks
        const projectEvents = projectsResponse.data.map(project => ({
          id: `project-${project.id}`,
          title: `Project: ${project.name}`,
          start: new Date(project.startDate),
          end: new Date(project.endDate),
          allDay: true,
          color: '#3174ad'
        }));

        const taskEvents = tasksResponse.data.map(task => ({
          id: `task-${task.id}`,
          title: `Task: ${task.name}`,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          allDay: true,
          color: '#59a14f'
        }));

        setEvents([...projectEvents, ...taskEvents]);

      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleLogout();
        } else {
          setError('Failed to fetch data. Please try again later.');
          console.error('Error fetching data:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },);

  const handleTimeframeChange = (value) => {
    setSelectedTimeframe(value);
  };

  const handleDownloadReport = () => {
    // Implement report download functionality
    console.log('Downloading report...');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">Reports Dashboard</h2>
        <p className="text-gray-600">Welcome, {user?.username}! Here's an overview of your project reports.</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <Select onValueChange={handleTimeframeChange} defaultValue={selectedTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleDownloadReport} className="flex items-center">
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project Completion Status */}
        <Card className="col-span-1 bg-gradient-to-r from-blue-400 to-indigo-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChartIcon className="mr-2" /> Project Completion Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.projectCompletion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData.projectCompletion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card className="col-span-1 bg-gradient-to-r from-green-400 to-teal-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="mr-2" /> Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.taskDistribution}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#8884d8" name="Completed" />
                <Bar dataKey="inProgress" fill="#82ca9d" name="In Progress" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Tracking */}
        <Card className="col-span-1 bg-gradient-to-r from-purple-400 to-pink-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2" /> Time Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.timeTracking}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Hours" />
                <Line type="monotone" dataKey="estimated" stroke="#82ca9d" name="Estimated Hours" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;