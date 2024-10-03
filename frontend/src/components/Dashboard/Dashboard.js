

import React, { useState, useContext, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import Spinner from "../Common/Spinner";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Bell,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Select } from "./UIComponents";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Simple versions of missing components
const CardTitle = ({ children, className, ...props }) => (
  <h3 className={`text-xl font-semibold ${className}`} {...props}>
    {children}
  </h3>
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
  const [userResponse, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, tasksResponse] = await Promise.all([
          apiClient.get("/projects"),
          apiClient.get("/tasks"),
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
        const projectEvents = projectsResponse.data.map((project) => ({
          id: `project-${project.id}`,
          title: `Project: ${project.name}`,
          start: new Date(project.startDate),
          end: new Date(project.endDate),
          allDay: true,
          color: "#3174ad",
        }));

        const taskEvents = tasksResponse.data.map((task) => ({
          id: `task-${task.taskId}`,
          title: `Task: ${task.taskName}`,
          start: new Date(task.start_date),
          end: new Date(task.due_date),
          allDay: true,
          color: "#59a14f",
        }));

        setEvents([...projectEvents, ...taskEvents]);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleLogout();
        } else {
          setError("Failed to fetch data. Please try again later.");
          console.error("Error fetching data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [handleLogout]);

  const currentProjects = projects.filter(
    (project) =>
      project.progress < 100 &&
      new Date(project.startDate) <= new Date() &&
      new Date(project.endDate) >= new Date()
  );
  const upcomingProjects = projects.filter(
    (project) => new Date(project.startDate) > new Date()
  );
  const overdueProjects = projects.filter(
    (project) =>
      new Date(project.endDate) < new Date() && project.progress < 100
  );

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleSelectEvent = (event) => {
    console.log("Selected event:", event);
  };

  const handleSelectSlot = (slotInfo) => {
    const title = prompt("Enter a title for your event:");
    if (title) {
      const newEvent = {
        id: `custom-${Date.now()}`,
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: slotInfo.slots.length === 1,
        color: "#e8c1a0", // Custom color for user-added events
      };
      setEvents([...events, newEvent]);
    }
  };

  const projectPerformanceData = projects.map((project) => ({
    name: project.name,
    actualTime: project.duration || 0,
    allocatedTime: project.allocatedTime || 0,
  }));

  const projectStatusData = [
    { name: "Current", value: currentProjects.length },
    { name: "Upcoming", value: upcomingProjects.length },
    { name: "Overdue", value: overdueProjects.length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

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
          <Card className="col-span-3 bg-white">
            <CardHeader>
              <CardTitle className="text-darkGray flex items-center">
                <Briefcase className="mr-2" /> Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <div>
                <p>Total Projects: {projects.length}</p>
                <p>Current Projects: {currentProjects.length}</p>
              </div>
              <div>
                <p>Upcoming Projects: {upcomingProjects.length}</p>
                <p>Overdue Projects: {overdueProjects.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Projects */}
          <Card className="col-span-1 bg-lightGray">
            <CardHeader>
              <CardTitle className="text-darkGray flex items-center">
                <CalendarIcon className="mr-2" /> Current Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white p-2 rounded-md shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <h4 className="text-lg font-semibold text-darkGray mb-1">
                      {project.name}
                    </h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Progress: {project.progress}%</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          project.progress < 50
                            ? "bg-red-200 text-red-800"
                            : project.progress < 80
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {project.progress < 50
                          ? "At Risk"
                          : project.progress < 80
                          ? "In Progress"
                          : "Near Completion"}
                      </span>
                    </div>
                    <div className="w-full bg-lightGray rounded-full h-2.5">
                      <div
                        className="bg-darkGray h-2.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Section */}
          <Card className="col-span-2 bg-white">
            <CardHeader>
              <CardTitle className="text-darkGray flex items-center">
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
          <Card className="bg-lightGray">
            <CardHeader>
              <CardTitle className="text-darkGray flex items-center">
                <Bell className="mr-2" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="bg-white p-2 rounded-md text-darkGray"
                    >
                      {notification}
                    </li>
                  ))
                ) : (
                  <li>No new notifications.</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="col-span-1 bg-white">
            <CardHeader>
              <CardTitle className="text-darkGray">
                Project Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectPerformanceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actualTime" fill="#86BC25" name="Actual Time" />
                  <Bar
                    dataKey="allocatedTime"
                    fill="#00653b"
                    name="Allocated Time"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project Status Chart */}
          <Card className="col-span-1 bg-white">
            <CardHeader>
              <CardTitle className="text-darkGray">Project Status</CardTitle>
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
                    fill="#86BC25"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
              <p>
                Start Date:{" "}
                {new Date(selectedProject.startDate).toLocaleDateString()}
              </p>
              <p>
                End Date:{" "}
                {new Date(selectedProject.endDate).toLocaleDateString()}
              </p>
              <p>Progress: {selectedProject.progress}%</p>
              <button
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
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
};

export default Dashboard; 
/*import React from 'react';
import { Bell, Search, Menu, MoreVertical, MessageSquare, Clock, User } from 'lucide-react';

const ProjectCard = ({ title, progress, date, color, daysLeft }) => (
  <div className={`bg-${color}-100 p-4 rounded-lg`}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold">{title}</h3>
      <MoreVertical size={16} />
    </div>
    <p className="text-sm text-gray-600 mb-2">{date}</p>
    <p className="font-semibold mb-1">Progress</p>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`bg-${color}-500 h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
    </div>
    <div className="flex items-center mt-2">
      <Clock size={16} className="mr-1" />
      <span className="text-sm">{daysLeft} days left</span>
    </div>
  </div>
);

const MessageItem = ({ name, message, date, avatar }) => (
  <div className="flex items-start mb-4">
    <img src={avatar} alt={name} className="w-10 h-10 rounded-full mr-3" />
    <div className="flex-grow">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-sm text-gray-600">{message}</p>
      <p className="text-xs text-gray-400">{date}</p>
    </div>
    <button className="text-blue-500">
      <MessageSquare size={16} />
    </button>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-16 bg-white shadow-md">
        <div className="flex flex-col items-center py-4">
          <Menu className="mb-8" />
          <User className="mb-4" />
          <MessageSquare className="mb-4" />
          <Clock className="mb-4" />
        </div>
      </aside>
      
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input type="text" placeholder="Search" className="pl-8 pr-4 py-2 rounded-full bg-white" />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button className="mr-4">
              <Bell />
            </button>
            <img src="/api/placeholder/40/40" alt="User avatar" className="w-10 h-10 rounded-full" />
          </div>
        </header>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="font-semibold text-2xl">45</h3>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="font-semibold text-2xl">12</h3>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="font-semibold text-2xl">10</h3>
              <p className="text-sm text-gray-600">Upcoming</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h3 className="font-semibold text-2xl">67</h3>
              <p className="text-sm text-gray-600">Total Project</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ProjectCard title="Web Designing" progress={90} date="July 2, 2020" color="blue" daysLeft={2} />
            <ProjectCard title="Mobile App" progress={30} date="July 5, 2020" color="pink" daysLeft={3} />
            <ProjectCard title="Dashboard" progress={50} date="July 10, 2020" color="green" daysLeft={5} />
          </div>
        </section>
      </main>
      
      <aside className="w-1/4 bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <MessageItem 
          name="David" 
          message="Hey! Tell me about progress of project? Waiting for your response." 
          date="21 July"
          avatar="/api/placeholder/40/40"
        />
        <MessageItem 
          name="Stephanie" 
          message="I got your first assignment. It was quite good 👍 You can start work on next assignment" 
          date="18 July"
          avatar="/api/placeholder/40/40"
        />
        <MessageItem 
          name="William" 
          message="I want some changes in previous work you sent me. Waiting for your reply." 
          date="17 July"
          avatar="/api/placeholder/40/40"
        />
      </aside>
    </div>
  );
};

export default Dashboard;*/

