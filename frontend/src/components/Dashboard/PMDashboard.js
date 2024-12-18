import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import apiClient from "../../utils/apiClient";
import { useTheme } from "../../contexts/ThemeContext"; // Import the theme context
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useAuth } from "../../contexts/AuthContext";
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
  CalendarIcon,
  Clock,
  AlertTriangle,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./UIComponents";
import CategoryModal from "./CategorialModal";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const CardTitle = ({ children, className, ...props }) => (
  <h3 className={`text-xl font-semibold ${className}`} {...props}>
    {children}
  </h3>
);
const colors = {
  primary: "#86BC25",
  secondary: "#0076A8",
  tertiary: "#E87722",
  quaternary: "#62B5E5",
  darkGray: "#2D2D2D",
};
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PMDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ username: "", email: "" }); // Declare formData
  const { updateUser } = useAuth(); // Get updateUser from AuthContext
  const navigate = useNavigate(); // Initialize navigate for page redirection
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isDarkMode } = useTheme(); // Use the context

  // Fetch projects and tasks data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        // Fetch projects and tasks
        const [projectsResponse, tasksResponse] = await Promise.all([
          apiClient.get("/projects"),
          apiClient.get("/tasks"),
        ]);
  
        if (projectsResponse.status === 200 && tasksResponse.status === 200) {
          setProjects(projectsResponse.data);
          setTasks(tasksResponse.data);
  
          // Create events from projects and tasks for the calendar view
          const projectEvents = projectsResponse.data.map((project) => ({
            id: `project-${project.id}`,
            title: `Project: ${project.name}`,
            start: new Date(project.startDate),
            end: new Date(project.endDate),
            allDay: true,
            color: project.status === 'completed' ? colors.tertiary : colors.primary,
          }));
  
          const taskEvents = tasksResponse.data.map((task) => ({
            id: `task-${task.id}`,
            title: `Task: ${task.taskName}`,
            start: new Date(task.start_date),
            end: new Date(task.due_date),
            allDay: true,
            color: task.status === 'completed' ? colors.secondary : colors.quaternary,
          }));
  
          setEvents([...projectEvents, ...taskEvents]);
        } else {
          setError("Failed to fetch projects or tasks data.");
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

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
  const agentProjects = projects.filter((project) =>
    tasks.some(
      (task) =>
        task.projectId === project.id &&
        (task.actualHours > task.hours || new Date(task.due_date) < new Date())
    )
  );

  // Handle user profile update
  const handleProfileUpdate = async () => {
    try {
      const updatedUser = await apiClient.put("/users/profile", formData); // API call to update user profile
      updateUser(updatedUser.data); // Update the user in AuthContext
      navigate("/settings"); // Navigate back to settings
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCategoryClick = (categoryTitle) => {
    setSelectedCategory(categoryTitle);
  };

  const handleSelectEvent = (event) => {
    console.log("Selected event:", event);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const projectPerformanceData = projects.map((project) => ({
    name: project.name,
    actualTime: project.actualHours || 0,
    allocatedTime: project.duration || 0,
  }));

  const projectStatusData = [
    { name: "Current", value: currentProjects.length },
    { name: "Upcoming", value: upcomingProjects.length },
    { name: "Overdue", value: overdueProjects.length },
    { name: "Urgent", value: agentProjects.length },
  ];

  const getSelectedDateInfo = () => {
    const selectedDateEvents = events.filter(
      (event) =>
        (event.start <= selectedDate && event.end >= selectedDate) ||
        moment(event.start).isSame(selectedDate, "day") ||
        moment(event.end).isSame(selectedDate, "day")
    );

    return selectedDateEvents.map((event) => ({
      title: event.title,
      status: moment(event.start).isSame(selectedDate, "day")
        ? "Starting"
        : moment(event.end).isSame(selectedDate, "day")
        ? "Due"
        : "Ongoing",
    }));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div
      className={`mx-auto p-4 min-h-screen ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <header
        className={`mb-6 p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
       
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
          Welcome back, {user?.username}!
        </h2>
      </header>

      <main className="flex-1 space-y-6">
        {/* Project Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Current Projects",
              value: currentProjects.length,
              icon: Briefcase,
              color: colors.primary,
            },
            {
              title: "Upcoming Projects",
              value: upcomingProjects.length,
              icon: Clock,
              color: colors.secondary,
            },
            {
              title: "Overdue Projects",
              value: overdueProjects.length,
              icon: AlertTriangle,
              color: colors.tertiary,
            },
            {
              title: "Urgent Projects",
              value: agentProjects.length,
              icon: TrendingUp,
              color: colors.quaternary,
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(item.title)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className={` text-sm font-medium ${isDarkMode ? 'text-white' : 'text-darkGray'}`}>
                  {item.title}
                </CardTitle>
                <item.icon className= {`  h-4 w-4 text-muted-foreground ${isDarkMode ? 'text-white' : 'text-darkGray'}`} />
              </CardHeader>
              <CardContent>
                <div
                  className="text-2xl font-bold"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Calendar and Selected Date Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
                  <CardTitle className={`flex items-center ${isDarkMode ? 'text-white' : 'text-darkGray'}`}>Project and Task Calendar <CalendarIcon className={`  mr-2 ${isDarkMode ? 'text-white' : 'text-darkGray'}`}/>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className= {` ${isDarkMode ? 'text-white' : 'text-darkGray'}`}
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

          <Card>
            <CardHeader>
            <CardTitle className={`${isDarkMode ? 'text-white' : 'text-darkGray'}`}>Selected Date Info</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold mb-2">
                {moment(selectedDate).format("MMMM D, YYYY")}
              </h3>
              <ul>
                {getSelectedDateInfo().map((event, index) => (
                  <li key={index} className={`mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          event.status === "Starting"
                            ? colors.primary
                            : event.status === "Due"
                            ? colors.tertiary
                            : colors.secondary,
                      }}
                    ></span>
                    {event.title} - {event.status}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className={`col-span-1 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>

          <CardHeader>
          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-darkGray'}`}>Project Performance</CardTitle>
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
          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-darkGray'}`}>Project Status</CardTitle>
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

      {/* Category Details Modal */}
      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          projects={
            selectedCategory === "Current Projects"
              ? currentProjects
              : selectedCategory === "Upcoming Projects"
              ? upcomingProjects
              : selectedCategory === "Overdue Projects"
              ? overdueProjects
              : selectedCategory === "Agent Projects"
              ? agentProjects
              : []
          }
          tasks={tasks}
          onClose={() => setSelectedCategory(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default PMDashboard;
