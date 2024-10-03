

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