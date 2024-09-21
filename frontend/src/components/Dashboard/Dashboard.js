import React, { useState, useContext, useEffect } from "react";
import apiClient from '../../utils/apiClient';
import { AuthContext } from '../../contexts/AuthContext';
import Spinner from '../Common/Spinner';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Bell, Calendar as CalendarIcon, Clock, AlertTriangle, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader } from "./UIComponents";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

// Simple versions of missing components
const CardTitle = ({ children, className, ...props }) => (
  <h3 className={`text-xl font-semibold ${className}`} {...props}>{children}</h3>
);

const Alert = ({ children, className, ...props }) => (
  <div className={`bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 ${className}`} {...props}>{children}</div>
);

const AlertDescription = ({ children, ...props }) => (
  <p className="text-sm" {...props}>{children}</p>
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, handleLogout } = useContext(AuthContext);
  const [selectedProject, setSelectedProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

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
        setUser(userResponse.data);
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
  }, [handleLogout]);

  const currentProjects = projects.filter(project => project.progress < 100 && new Date(project.startDate) <= new Date() && new Date(project.endDate) >= new Date());
  const upcomingProjects = projects.filter(project => new Date(project.startDate) > new Date());
  const overdueProjects = projects.filter(project => new Date(project.endDate) < new Date() && project.progress < 100);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleSelectEvent = (event) => {
    // Handle event selection (e.g., show details, allow editing)
    console.log('Selected event:', event);
  };

  const handleSelectSlot = (slotInfo) => {
    const title = prompt('Enter a title for your event:');
    if (title) {
      const newEvent = {
        id: `custom-${Date.now()}`,
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: slotInfo.slots.length === 1,
        color: '#e8c1a0' // Custom color for user-added events
      };
      setEvents([...events, newEvent]);
    }
  };

  const projectPerformanceData = projects.map(project => ({
    name: project.name,
    actualTime: project.actualTime || 0,
    allocatedTime: project.allocatedTime || 0,
  }));

  const projectStatusData = [
    { name: 'Current', value: currentProjects.length },
    { name: 'Upcoming', value: upcomingProjects.length },
    { name: 'Overdue', value: overdueProjects.length }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

 /* return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">
          Welcome back, {user?.username}!
        </h2>
<<<<<<< HEAD
      </header>
      
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {// Project Overview //}
        <Card className="col-span-3 bg-gradient-to-r from-blue-400 to-indigo-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Briefcase className="mr-2" /> Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div>
              <p className="text-white">Total Projects: {projects.length}</p>
              <p className="text-white">Current Projects: {currentProjects.length}</p>
            </div>
            <div>
              <p className="text-white">Upcoming Projects: {upcomingProjects.length}</p>
              <p className="text-white">Overdue Projects: {overdueProjects.length}</p>
            </div>
          </CardContent>
        </Card>
=======
        </div>
>>>>>>> 03412d113761a75f5b9dca6040dc583f65e282d4

        {// Current Projects //}
        <Card className="col-span-1 bg-gradient-to-r from-blue-400 to-indigo-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CalendarIcon className="mr-2" /> Current Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-white bg-opacity-20 p-2 rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <h4 className="text-lg font-semibold text-white mb-1">{project.name}</h4>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white">Progress: {project.progress}%</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      project.progress < 50 ? "bg-red-200 text-red-800" :
                      project.progress < 80 ? "bg-yellow-200 text-yellow-800" :
                      "bg-green-200 text-green-800"
                    }`}>
                      {project.progress < 50 ? "At Risk" : project.progress < 80 ? "In Progress" : "Near Completion"}
                    </span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5">
                    <div
                      className="bg-white h-2.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {// Upcoming Projects //}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="mr-2" /> Upcoming Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingProjects.length > 0 ? upcomingProjects.map(project => (
                <div key={project.id} className="bg-white bg-opacity-20 p-2 rounded-md text-white">
                  {project.name} (Starts on: {new Date(project.startDate).toLocaleDateString()})
                </div>
              )) : <p className="text-white">No upcoming projects.</p>}
            </div>
          </CardContent>
        </Card>

        {// Overdue Projects /}
        <Card className="bg-gradient-to-r from-red-400 to-pink-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="mr-2" /> Overdue Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueProjects.length > 0 ? overdueProjects.map(project => (
                <div key={project.id} className="bg-white bg-opacity-20 p-2 rounded-md text-white">
                  {project.name} (Due: {new Date(project.endDate).toLocaleDateString()})
                </div>
              )) : <p className="text-white">No overdue projects.</p>}
            </div>
          </CardContent>
        </Card>

        {// Calendar Section //}
        <Card className="col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <CalendarIcon className="mr-2" /> Project and Task Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400 }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.color,
                },
              })}
            />
          </CardContent>
        </Card>

        {// Notifications //}
        <Card className="bg-gradient-to-r from-purple-400 to-pink-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="mr-2" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notifications.length > 0 ? notifications.map((notification, index) => (
                <li key={index} className="bg-white bg-opacity-20 p-2 rounded-md text-white">
                  {notification}
                </li>
              )) : <li className="text-white">No new notifications.</li>}
            </ul>
          </CardContent>
        </Card>

        {// Performance Chart //}
        <Card className="col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800">Project Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="actualTime" fill="#8884d8" name="Actual Time" />
                <Bar dataKey="allocatedTime" fill="#82ca9d" name="Allocated Time" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {// Project Status Chart //}
        <Card className="col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>

      {// Project Details Modal //}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>{selectedProject.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{selectedProject.description}</p>
              <p>Start Date: {new Date(selectedProject.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(selectedProject.endDate).toLocaleDateString()}</p>
              <p>Progress: {selectedProject.progress}%</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => setSelectedProject(null)}
              >
<<<<<<< HEAD
                Close
              </button>
            </CardContent>
          </Card>
        </div>
      )}
=======
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.name}
                </h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress: {project.progress}%</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    project.progress < 50 ? "bg-red-200 text-red-800" :
                    project.progress < 80 ? "bg-yellow-200 text-yellow-800" :
                    "bg-green-200 text-green-800"
                  }`}>
                    {project.progress < 50 ? "At Risk" : project.progress < 80 ? "In Progress" : "Near Completion"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
>>>>>>> 03412d113761a75f5b9dca6040dc583f65e282d4

      {// Selected Date Alert //}
      {selectedDate && (
        <Alert className="fixed bottom-4 right-4 w-64">
          <AlertDescription>
            Selected Date: {selectedDate.toLocaleDateString()}
            <br />
            {events.filter(event => 
              selectedDate >= event.start && selectedDate <= event.end
            ).map(event => (
              <div key={event.title}>{event.title} {selectedDate.toDateString() === event.start.toDateString() ? 'starting' : 'in progress'}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default Dashboard;*/

return (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <header className="mb-6">
      <h2 className="text-3xl font-bold text-indigo-800">
        Welcome back, {user?.username}!
      </h2>
    </header>

    {/* Main Content Wrapper */}
    <div className="flex-1 overflow-auto">
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Overview */}
        <Card className="col-span-3 bg-gradient-to-r from-blue-400 to-indigo-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Briefcase className="mr-2" /> Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div>
              <p className="text-white">Total Projects: {projects.length}</p>
              <p className="text-white">Current Projects: {currentProjects.length}</p>
            </div>
            <div>
              <p className="text-white">Upcoming Projects: {upcomingProjects.length}</p>
              <p className="text-white">Overdue Projects: {overdueProjects.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Current Projects */}
        <Card className="col-span-1 bg-gradient-to-r from-blue-400 to-indigo-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CalendarIcon className="mr-2" /> Current Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white bg-opacity-20 p-2 rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <h4 className="text-lg font-semibold text-white mb-1">
                    {project.name}
                  </h4>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white">
                      Progress: {project.progress}%
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.progress < 50
                          ? 'bg-red-200 text-red-800'
                          : project.progress < 80
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {project.progress < 50
                        ? 'At Risk'
                        : project.progress < 80
                        ? 'In Progress'
                        : 'Near Completion'}
                    </span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5">
                    <div
                      className="bg-white h-2.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Projects */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="mr-2" /> Upcoming Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingProjects.length > 0 ? (
                upcomingProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white bg-opacity-20 p-2 rounded-md text-white"
                  >
                    {project.name} (Starts on:{' '}
                    {new Date(project.startDate).toLocaleDateString()})
                  </div>
                ))
              ) : (
                <p className="text-white">No upcoming projects.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Projects */}
        <Card className="bg-gradient-to-r from-red-400 to-pink-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="mr-2" /> Overdue Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueProjects.length > 0 ? (
                overdueProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white bg-opacity-20 p-2 rounded-md text-white"
                  >
                    {project.name} (Due:{' '}
                    {new Date(project.endDate).toLocaleDateString()})
                  </div>
                ))
              ) : (
                <p className="text-white">No overdue projects.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <Card className="col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center">
              <CalendarIcon className="mr-2" /> Project and Task Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400 }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.color,
                },
              })}
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gradient-to-r from-purple-400 to-pink-500">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="mr-2" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="bg-white bg-opacity-20 p-2 rounded-md text-white"
                  >
                    {notification}
                  </li>
                ))
              ) : (
                <li className="text-white">No new notifications.</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800">Project Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="actualTime" fill="#8884d8" name="Actual Time" />
                <Bar dataKey="allocatedTime" fill="#82ca9d" name="Allocated Time" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Chart */}
        <Card className="col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-800">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>

    {/* Project Details Modal */}
    {selectedProject && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>{selectedProject.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{selectedProject.description}</p>
            <p>Start Date: {new Date(selectedProject.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(selectedProject.endDate).toLocaleDateString()}</p>
            <p>Progress: {selectedProject.progress}%</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setSelectedProject(null)}
            >
              Close
            </button>
          </CardContent>
        </Card>
      </div>
    )}
  </div>
);
}
export default Dashboard;
