import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import apiClient from "../../utils/apiClient";
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
import {
  Card,
  CardContent,
  CardHeader,
  Button
} from "./UIComponents";

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

const ConsultantDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const tasksResponse = await apiClient.get(`/tasks?consultantId=${user.id}`);
        setTasks(tasksResponse.data);

        const taskEvents = tasksResponse.data.map(task => ({
          id: `task-${task.id}`,
          title: `Task: ${task.taskName}`,
          start: new Date(task.start_date),
          end: new Date(task.due_date),
          allDay: true,
          color: colors.secondary,
        }));

        setEvents(taskEvents);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
  };

  const getSelectedDateInfo = () => {
    const selectedDateEvents = events.filter(
      (event) =>
        (event.start <= selectedDate && event.end >= selectedDate) ||
        moment(event.start).isSame(selectedDate, 'day') ||
        moment(event.end).isSame(selectedDate, 'day')
    );

    return selectedDateEvents.map(event => ({
      title: event.title,
      status: moment(event.start).isSame(selectedDate, 'day') 
        ? "Starting" 
        : moment(event.end).isSame(selectedDate, 'day')
          ? "Due"
          : "Ongoing"
    }));
  };

  const currentTasks = tasks.filter(
    (task) =>
      new Date(task.start_date) <= new Date() &&
      new Date(task.due_date) >= new Date()
  );
  const upcomingTasks = tasks.filter((task) => 
    new Date(task.start_date) > new Date()
  );
  const overdueTasks = tasks.filter((task) => 
    new Date(task.due_date) < new Date() && task.status !== "Completed"
  );

  const taskStatusData = [
    { name: "Current", value: currentTasks.length },
    { name: "Upcoming", value: upcomingTasks.length },
    { name: "Overdue", value: overdueTasks.length },
  ];

  const taskPerformanceData = tasks.map((task) => ({
    name: task.taskName,
    actualHours: task.actualHours || 0,
    allocatedHours: task.allocatedHours || 0,
  }));

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.username}!
        </h2>
      </header>

      <main className="flex-1 space-y-6">
        {/* Task Overview */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: "Current Tasks", value: currentTasks.length, icon: Briefcase, color: colors.primary },
            { title: "Upcoming Tasks", value: upcomingTasks.length, icon: Clock, color: colors.secondary },
            { title: "Overdue Tasks", value: overdueTasks.length, icon: AlertTriangle, color: colors.tertiary },
          ].map((item, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{ color: item.color }}>
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
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2" /> My Tasks Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 400 }}
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
              <CardTitle>Selected Date Info</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold mb-2">
                {moment(selectedDate).format('MMMM D, YYYY')}
              </h3>
              <ul>
                {getSelectedDateInfo().map((event, index) => (
                  <li key={index} className="mb-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: event.status === "Starting" ? colors.primary : event.status === "Due" ? colors.tertiary : colors.secondary }}
                    ></span>
                    {event.title} - {event.status}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Task Performance Chart */}
        <Card className="col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="text-darkGray">Task Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="actualHours" fill="#86BC25" name="Actual Hours" />
                <Bar dataKey="allocatedHours" fill="#00653b" name="Allocated Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Status Chart */}
        <Card className="col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="text-darkGray">Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#86BC25"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
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
  );
};

export default ConsultantDashboard;