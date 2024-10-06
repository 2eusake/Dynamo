import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext"; // Import the theme context

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
import { Card, CardContent, CardHeader, CardTitle } from "./UIComponents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./UIComponents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge,
} from "./UIComponents";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "./UIComponents";
import jsPDF from "jspdf";
import "jspdf-autotable";
import apiClient from "../../utils/apiClient";

// Deloitte colors
const colors = {
  primary: "#86BC25",
  secondary: "#0076A8",
  tertiary: "#62B5E5",
  quaternary: "#00A3E0",
  black: "#000000",
  white: "#FFFFFF",
};
const statusColors = {
  completed: "bg-green-500",
  "in progress": "bg-blue-500",
  overdue: "bg-red-500",
  pending: "bg-yellow-500",
};

const ProjectReportDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const { isDarkMode } = useTheme(); // Access dark mode state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedProjectManager, setSelectedProjectManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          apiClient.get(`/projects`),
          apiClient.get(`/tasks`),
          apiClient.get(`/users`),
        ]);
        console.log("Projects data:", projectsRes.data);
        console.log("Tasks data:", tasksRes.data);
        console.log("Users data:", usersRes.data);
        if (!Array.isArray(projectsRes.data) || !Array.isArray(tasksRes.data)) {
          throw new Error(
            "Projects or Tasks data is not in the expected format"
          );
        }
        const projectsWithHours = projectsRes.data.map((project) => {
          const projectTasks = tasksRes.data.filter(
            (task) => task.projectId === project.id
          );
          const allocatedHours = projectTasks.reduce(
            (sum, task) => sum + (parseFloat(task.hours) || 0),
            0
          );
          const actualHours = projectTasks.reduce(
            (sum, task) => sum + (parseFloat(task.actualHours) || 0),
            0
          );

          return {
            ...project,
            allocatedHours: parseFloat(allocatedHours.toFixed(2)),
            actualHours: parseFloat(actualHours.toFixed(2)),
          };
        });
        const processedTasks = tasksRes.data.map((task) => {
          const progress = (task.actualHours / task.hours) * 100;
          const isOverbudget = task.actualHours > task.hours;
          return {
            ...task,
            progress: parseFloat(progress.toFixed(2)),
            isOverbudget,
            comment: isOverbudget
              ? `Exceeding allocated time by ${(
                  task.actualHours - task.hours
                ).toFixed(2)} hours`
              : "",
          };
        });

        // Process projects with enhanced budget tracking
        const projectsWithBudget = projectsRes.data.map((project) => {
          const projectTasks = processedTasks.filter(
            (task) => task.projectId === project.id
          );
          const allocatedHours = projectTasks.reduce(
            (sum, task) => sum + (parseFloat(task.hours) || 0),
            0
          );
          const actualHours = projectTasks.reduce(
            (sum, task) => sum + (parseFloat(task.actualHours) || 0),
            0
          );
          const overbudgetTasks = projectTasks.filter(
            (task) => task.isOverbudget
          );
          const progress =
            projectTasks.reduce((avg, task) => avg + task.progress, 0) /
            projectTasks.length;

          return {
            ...project,
            allocatedHours: parseFloat(allocatedHours.toFixed(2)),
            actualHours: parseFloat(actualHours.toFixed(2)),
            isOverbudget: actualHours > allocatedHours,
            overbudgetTasks,
            progress: isNaN(progress) ? 0 : parseFloat(progress.toFixed(2)),
          };
        });

        let consultants = [];
        let projectManagers = [];

        if (Array.isArray(usersRes.data)) {
          consultants = usersRes.data.filter(
            (user) => user.role === "Consultant"
          );
          projectManagers = usersRes.data.filter(
            (user) => user.role === "Project Manager"
          );
        } else if (typeof usersRes.data === "object") {
          // If the data is an object, it might be structured differently
          consultants = usersRes.data.consultants || [];
          projectManagers = usersRes.data.projectManagers || [];
        } else {
          console.error("Unexpected users data format:", usersRes.data);
        }
        const projectsWithProgress = projectsWithHours.map((project) => {
          const startDate = new Date(project.startDate);
          const endDate = new Date(project.endDate);
          const currentDate = new Date();
          const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
          const daysIn = (currentDate - startDate) / (1000 * 60 * 60 * 24);
          const daysLeft = (endDate - currentDate) / (1000 * 60 * 60 * 24);
          return {
            ...project,
            daysIn: Math.max(0, Math.min(daysIn, totalDays)),
            daysLeft: Math.max(0, daysLeft),
          };
        });

        setProjects(projectsWithHours);
        setProjects(projectsWithProgress);
        setProjects(projectsWithBudget);
        setTasks(processedTasks);
        setTasks(tasksRes.data);
        setConsultants(consultants);
        setProjectManagers(projectManagers);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const overallPerformance = projects.reduce(
    (acc, project) => {
      acc.allocatedHours += project.allocatedHours;
      acc.actualHours += project.actualHours;
      return acc;
    },
    { allocatedHours: 0, actualHours: 0 }
  );

  const projectStatus = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const projectStatusData = Object.entries(projectStatus).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const overdueProjects = projects.filter(
    (p) => new Date(p.endDate) < new Date() && p.status !== "completed"
  ).length;
  const overbudgetProjects = projects.filter(
    (p) => p.actualHours > p.allocatedHours
  ).length;

  const getConsultantTasks = (consultantId) => {
    return tasks.filter((task) => task.assigned_to_user_id === consultantId);
  };

  const getProjectManagerProjects = (projectManagerId) => {
    return projects.filter(
      (project) => project.projectManagerId === projectManagerId
    );
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const getProjectConsultants = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    const consultantIds = [
      ...new Set(projectTasks.map((task) => task.assigned_to_user_id)),
    ];
    return consultants.filter((consultant) =>
      consultantIds.includes(consultant.id)
    );
  };

  const getTaskStatusSummary = (tasks) => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  };

  const exportDashboardData = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Project Dashboard Report", 14, 22);

    // Overview section
    doc.setFontSize(14);
    doc.text("Overview", 14, 32);

    const overviewData = [
      ["Total Projects", projects.length],
      ["Completed Projects", completedProjects],
      ["Overdue Projects", overdueProjects],
      ["Over-budget Projects", overbudgetProjects],
      ["Total Consultants", consultants.length],
      ["Total Project Managers", projectManagers.length],
    ];

    doc.autoTable({
      startY: 36,
      head: [["Metric", "Value"]],
      body: overviewData,
    });

    // Projects section
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Project Details", 14, 22);

    const projectsData = projects.map((project) => [
      project.name,
      project.status,
      project.allocatedHours,
      project.actualHours,
      project.startDate,
      project.endDate,
    ]);

    doc.autoTable({
      startY: 26,
      head: [
        [
          "Name",
          "Status",
          "Allocated Hours",
          "Actual Hours",
          "Start Date",
          "End Date",
        ],
      ],
      body: projectsData,
    });
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Task Details", 14, 22);

    const taskData = tasks.map((task) => [
      task.taskName,
      projects.find((p) => p.id === task.projectId)?.name || "N/A",
      task.hours || 0,
      task.actualHours || 0,
      `${task.progress}%`,
      task.isOverbudget ? "Yes" : "No",
    ]);

    doc.autoTable({
      startY: 26,
      head: [
        [
          "Task Name",
          "Project",
          "Allocated Hours",
          "Actual Hours",
          "Progress",
          "Overbudget",
        ],
      ],
      body: taskData,
    });

    // Save the PDF
    doc.save("project_dashboard_report.pdf");
  };
  const renderTaskList = (tasks) => {
    return tasks.map((task) => (
      <div key={task.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">{task.name}</h4>
          <Badge className={task.isOverbudget ? "bg-red-500" : "bg-green-500"}>
            {task.isOverbudget ? "Overbudget" : "On Budget"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <p className="text-sm text-gray-600">
              Allocated Hours: {task.hours}
            </p>
            <p className="text-sm text-gray-600">
              Actual Hours: {task.actualHours}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Progress</p>
            <Progress value={task.progress} className="mt-1" />
            <p className="text-sm text-gray-600 mt-1">{task.progress}%</p>
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Project Report Dashboard</h1>
      <Button onClick={exportDashboardData} className="mb-4">
        Export Dashboard PDF
      </Button>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="managers">Project Managers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Per Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projects}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="allocatedHours"
                      fill={colors.primary}
                      name="Allocated Hours"
                    />
                    <Bar
                      dataKey="actualHours"
                      fill={colors.secondary}
                      name="Actual Hours"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projects} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="daysIn"
                      stackId="a"
                      fill={colors.primary}
                      name="Days In"
                    />
                    <Bar
                      dataKey="daysLeft"
                      stackId="a"
                      fill={colors.secondary}
                      name="Days Left"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill={colors.tertiary}
                      label
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            Object.values(colors)[
                              index % Object.values(colors).length
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card
              className={
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }
            >
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-1/2">Completed Projects:</span>
                    <span className="w-1/2 font-semibold">
                      {completedProjects}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1/2">Overdue Projects:</span>
                    <span className="w-1/2 font-semibold">
                      {overdueProjects}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1/2">Over-budget Projects:</span>
                    <span className="w-1/2 font-semibold">
                      {overbudgetProjects}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card
            className={
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }
          >
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) =>
                  setSelectedProject(
                    projects.find((p) => p.id === parseInt(value))
                  )
                }
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProject && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">
                      {selectedProject.name}
                    </h3>
                    <Badge className={statusColors[selectedProject.status]}>
                      {selectedProject.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Status:</p>
                      <p>{selectedProject.status}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Allocated Hours:</p>
                      <p>{selectedProject.allocatedHours}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Actual Hours:</p>
                      <p>{selectedProject.actualHours}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Due Date:</p>
                      <p>{selectedProject.endDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Project Manager:</p>
                    <p>
                      {projectManagers.find(
                        (pm) => pm.id === selectedProject.projectManagerId
                      )?.username || "Not assigned"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Progress:</p>
                      <Progress
                        value={selectedProject.progress}
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedProject.progress}%
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Budget Status:</p>
                      <p
                        className={
                          selectedProject.isOverbudget
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {selectedProject.isOverbudget
                          ? "Over Budget"
                          : "On Budget"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4">
                      Tasks and Consultants
                    </h4>
                    {getProjectConsultants(selectedProject.id).map(
                      (consultant) => (
                        <div key={consultant.id} className="mb-6">
                          <div className="flex items-center mb-2">
                            <User className="w-5 h-5 mr-2" />
                            <h5 className="text-md font-semibold">
                              {consultant.username}
                            </h5>
                          </div>
                          {renderTaskList(
                            getConsultantTasks(consultant.id).filter(
                              (task) => task.projectId === selectedProject.id
                            )
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultants">
          <Card
            className={
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }
          >
            <CardHeader>
              <CardTitle>Consultant Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) =>
                  setSelectedConsultant(
                    consultants.find((c) => c.id === parseInt(value))
                  )
                }
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select a consultant" />
                </SelectTrigger>
                <SelectContent>
                  {consultants.map((consultant) => (
                    <SelectItem
                      key={consultant.id}
                      value={consultant.id.toString()}
                    >
                      {consultant.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedConsultant && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {selectedConsultant.username}'s Tasks
                  </h3>
                  {getConsultantTasks(selectedConsultant.id).map((task) => (
                    <div key={task.id} className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-semibold">{task.taskName}</p>
                      <p>
                        Project:{" "}
                        {projects.find((p) => p.id === task.projectId)?.name}
                      </p>
                      <p>
                        Allocated Hours: {task.hours}, Actual Hours:{" "}
                        {task.actualHours}
                      </p>
                      <Progress
                        value={(task.actualHours / task.hours) * 100}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers">
          <Card>
            <CardHeader>
              <CardTitle>Project Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) =>
                  setSelectedProjectManager(
                    projectManagers.find((pm) => pm.id === parseInt(value))
                  )
                }
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select a project manager" />
                </SelectTrigger>
                <SelectContent>
                  {projectManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProjectManager && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {selectedProjectManager.username}'s Projects
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={getProjectManagerProjects(
                        selectedProjectManager.id
                      )}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="allocatedHours"
                        fill={colors.primary}
                        name="Allocated Hours"
                      />
                      <Bar
                        dataKey="actualHours"
                        fill={colors.secondary}
                        name="Actual Hours"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  {getProjectManagerProjects(selectedProjectManager.id).map(
                    (project) => (
                      <div
                        key={project.id}
                        className="bg-gray-100 p-4 rounded-lg"
                      >
                        <h4 className="text-lg font-semibold">
                          {project.name}
                        </h4>
                        <p>Status: {project.status}</p>
                        <p>
                          Allocated Hours: {project.allocatedHours}, Actual
                          Hours: {project.actualHours}
                        </p>
                        <p>Due Date: {project.endDate}</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Overall Summary */}
      <Card
        className={`mt-8 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <CardHeader>
          <CardTitle>Overall Dashboard Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This dashboard provides a comprehensive overview of project
            performance across the organization:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Total Projects: {projects.length}</li>
            <li>Completed Projects: {completedProjects}</li>
            <li>Overdue Projects: {overdueProjects}</li>
            <li>Over-budget Projects: {overbudgetProjects}</li>
            <li>Total Consultants: {consultants.length}</li>
            <li>Total Project Managers: {projectManagers.length}</li>
          </ul>
          <p className="font-semibold mb-2">Key Observations:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              Overall project completion rate:{" "}
              {((completedProjects / projects.length) * 100).toFixed(2)}%
            </li>
            <li>
              Projects at risk or overdue:{" "}
              {(
                ((overdueProjects +
                  projects.filter((p) => p.status === "in progress").length) /
                  projects.length) *
                100
              ).toFixed(2)}
              %
            </li>
            <li>
              Resource utilization (Actual vs Allocated Hours):{" "}
              {(
                (overallPerformance.actualHours /
                  overallPerformance.allocatedHours) *
                100
              ).toFixed(2)}
              %
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
export default ProjectReportDashboard;
