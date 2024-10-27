import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext"; // Import the theme context
import html2pdf from "html2pdf.js";
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
  Button,
} from "./UIComponents";
import {
  AlertOctagon,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Target,
  Activity,
} from "lucide-react";
import apiClient from "../../utils/apiClient";

// Deloitte colors
const colors = {
  primary: "#86BC25",
  secondary: "#0076A8",
  tertiary: "#62B5E5",
  quaternary: "#00A3E0",
  success: "#00B140",
  warning: "#FFB81C",
  danger: "#E31B23",
  neutral: "#4A4A4A",
  black: "#000000",
  white: "#FFFFFF",
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
  const { id } = useParams();

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

        setProjects(projectsWithHours);
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
  const calculateTimeRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const calculateScheduleMetrics = (project) => {
    const totalDuration =
      new Date(project.endDate) - new Date(project.startDate);
    const elapsed = new Date() - new Date(project.startDate);
    const percentComplete = (elapsed / totalDuration) * 100;
    const daysRemaining = calculateTimeRemaining(project.endDate);
    const isOverdue = daysRemaining < 0;

    return {
      percentComplete: Math.min(percentComplete, 100),
      daysRemaining,
      isOverdue,
      totalDays: Math.ceil(totalDuration / (1000 * 60 * 60 * 24)),
      elapsedDays: Math.ceil(elapsed / (1000 * 60 * 60 * 24)),
    };
  };

  const getDetailedTaskMetrics = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    const completed = projectTasks.filter((t) => t.status === "completed");
    const inProgress = projectTasks.filter((t) => t.status === "in progress");
    const notStarted = projectTasks.filter((t) => t.status === "not started");

    return {
      total: projectTasks.length,
      completed: completed.length,
      inProgress: inProgress.length,
      notStarted: notStarted.length,
      completionRate: (completed.length / projectTasks.length) * 100,
    };
  };

  const exportToPDF = () => {
    const element = document.getElementById("project-dashboard");
    const opt = {
      margin: 1,
      filename: "project-performance-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const calculateProjectMetrics = (project) => {
    const scheduleMetrics = calculateScheduleMetrics(project);
    const taskMetrics = getDetailedTaskMetrics(project.id);
    const budgetVariance =
      ((project.actualHours - project.allocatedHours) /
        project.allocatedHours) *
      100;

    return {
      schedule: scheduleMetrics,
      tasks: taskMetrics,
      budget: {
        allocated: project.allocatedHours,
        actual: project.actualHours,
        variance: budgetVariance,
        utilizationRate: (project.actualHours / project.allocatedHours) * 100,
      },
      risk: calculateRiskLevel(project),
    };
  };

  const calculateRiskLevel = (project) => {
    let riskScore = 0;
    if (project.actualHours > project.allocatedHours) riskScore += 2;
    if (new Date(project.endDate) < new Date()) riskScore += 2;
    if (project.status === "at risk") riskScore += 3;
    return riskScore > 4 ? "High" : riskScore > 2 ? "Medium" : "Low";
  };
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
  const calculateTaskStatus = (task) => {
    const now = new Date();
    const dueDate = new Date(task.due_date);
    const completedDate = task.completedDate
      ? new Date(task.completedDate)
      : null;
    const isCompleted = task.status === "completed";
    const hoursRemaining = task.hours - task.actualHours;
    const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    const isOverdue = now > dueDate && !isCompleted;
    const isOverHours = task.actualHours > task.hours;

    if (isCompleted) {
      const daysBeforeDue = Math.ceil(
        (dueDate - completedDate) / (1000 * 60 * 60 * 24)
      );
      const completedOnTime =
        completedDate <= dueDate && task.actualHours <= task.hours;

      return {
        status: completedOnTime ? "completed-ontime" : "completed-late",
        message: completedOnTime
          ? `Completed ${daysBeforeDue} days before deadline${
              task.actualHours < task.hours ? " and under budget" : ""
            }`
          : `Completed ${Math.abs(daysBeforeDue)} days late${
              isOverHours
                ? ` and ${task.actualHours - task.hours} hours over budget`
                : ""
            }`,
        icon: completedOnTime ? CheckCircle : AlertTriangle,
        color: completedOnTime ? "text-green-500" : "text-orange-500",
      };
    } else {
      const atRisk = daysUntilDue < 3 || task.actualHours / task.hours > 0.8;
      const critical = isOverdue || isOverHours;

      return {
        status: critical ? "critical" : atRisk ? "at-risk" : "in-progress",
        message: critical
          ? `${isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : ""} ${
              isOverHours
                ? `Exceeded by ${task.actualHours - task.hours} hours`
                : ""
            }`
          : atRisk
          ? `At risk - ${daysUntilDue} days left, ${hoursRemaining} hours remaining`
          : `${daysUntilDue} days left, ${hoursRemaining} hours remaining`,
        icon: critical ? AlertOctagon : atRisk ? AlertTriangle : Clock,
        color: critical
          ? "text-red-500"
          : atRisk
          ? "text-orange-500"
          : "text-blue-500",
      };
    }
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div
      id="project-dashboard"
      className={`p-6 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black underline-green">
          Project Performance Dashboard
        </h1>
        <Button onClick={exportToPDF} className="flex items-center gap-2">
          <Download size={16} />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="managers">Project Managers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              className={
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Project Performance Overview
                </CardTitle>
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

            <Card
              className={
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }
            >
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Portfolio Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat-box">
                      <p className="text-sm text-gray-500">Active Projects</p>
                      <span className="text-2xl font-bold">
                        {projects.length}
                      </span>
                    </div>
                    <div className="stat-box">
                      <p className="text-sm text-gray-500">On Schedule</p>
                      <span className="text-2xl font-bold text-green-500">
                        {
                          projects.filter(
                            (p) => calculateTimeRemaining(p.endDate) > 0
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat-box">
                      <p className="text-sm text-gray-500">Completed</p>
                      <span className="text-2xl font-bold">
                        {completedProjects}
                      </span>
                    </div>
                    <div className="stat-box">
                      <p className="text-sm text-gray-500">Overdue</p>
                      <span className="text-2xl font-bold">
                        {overdueProjects}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Overall Progress
                    </p>
                    <Progress
                      value={
                        projects.reduce((acc, project) => {
                          const metrics = calculateProjectMetrics(project);
                          return acc + metrics.tasks.completionRate;
                        }, 0) / projects.length
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(
                        projects.reduce((acc, project) => {
                          const metrics = calculateProjectMetrics(project);
                          return acc + metrics.tasks.completionRate;
                        }, 0) / projects.length
                      )}
                      % Complete
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "High Risk",
                          value: projects.filter(
                            (p) => calculateRiskLevel(p) === "High"
                          ).length,
                        },
                        {
                          name: "Medium Risk",
                          value: projects.filter(
                            (p) => calculateRiskLevel(p) === "Medium"
                          ).length,
                        },
                        {
                          name: "Low Risk",
                          value: projects.filter(
                            (p) => calculateRiskLevel(p) === "Low"
                          ).length,
                        },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [colors.danger, colors.warning, colors.success][
                              index
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
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={projects}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="actualHours"
                      fill={colors.tertiary}
                      stroke={colors.secondary}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card> */}

            {/* <Card
              className={
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }
            >
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Completed Projects: {completedProjects}</li>
                  <li>Overdue Projects: {overdueProjects}</li>
                  <li>Over-budget Projects: {overbudgetProjects}</li>
                </ul>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
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
                <SelectTrigger>
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
                <div className="mt-6 space-y-6">
                  {/* Schedule Performance Card */}
                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar size={20} />
                        Schedule Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const metrics =
                          calculateProjectMetrics(selectedProject);
                        return (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Timeline Progress
                              </span>
                              <span className="text-sm">
                                {Math.round(metrics.schedule.percentComplete)}%
                              </span>
                            </div>
                            <Progress
                              value={metrics.schedule.percentComplete}
                              className="h-2"
                            />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Days Remaining
                                </p>
                                <p
                                  className={`text-xl font-bold ${
                                    metrics.schedule.isOverdue
                                      ? "text-red-500"
                                      : "text-green-500"
                                  }`}
                                >
                                  {Math.abs(metrics.schedule.daysRemaining)}{" "}
                                  days{" "}
                                  {metrics.schedule.isOverdue
                                    ? "overdue"
                                    : "left"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Due Date
                                </p>
                                <p className="text-xl font-bold">
                                  {new Date(
                                    selectedProject.endDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* Task Completion Card */}
                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target size={20} />
                        Task Completion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const metrics =
                          calculateProjectMetrics(selectedProject);
                        return (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Overall Progress
                              </span>
                              <span className="text-sm">
                                {Math.round(metrics.tasks.completionRate)}%
                              </span>
                            </div>
                            <Progress
                              value={metrics.tasks.completionRate}
                              className="h-2"
                            />
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Completed Tasks
                                </p>
                                <p className="text-xl font-bold text-green-500">
                                  {metrics.tasks.completed} /{" "}
                                  {metrics.tasks.total}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  In Progress
                                </p>
                                <p className="text-xl font-bold text-blue-500">
                                  {metrics.tasks.inProgress}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Not Started
                                </p>
                                <p className="text-xl font-bold text-gray-500">
                                  {metrics.tasks.notStarted}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users size={20} />
                        Resource Allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {getProjectConsultants(selectedProject.id).map(
                          (consultant) => {
                            const consultantTasks = getConsultantTasks(
                              consultant.id
                            ).filter((t) => t.projectId === selectedProject.id);
                            const totalHours = consultantTasks.reduce(
                              (acc, task) => acc + task.hours,
                              0
                            );
                            const actualHours = consultantTasks.reduce(
                              (acc, task) => acc + task.actualHours,
                              0
                            );

                            return (
                              <div
                                key={consultant.id}
                                className="bg-white p-6 rounded-lg shadow-sm space-y-4"
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="text-lg font-medium">
                                    {consultant.username}
                                  </h4>
                                </div>

                                <div className="space-y-4">
                                  {consultantTasks.map((task) => {
                                    const taskStatus =
                                      calculateTaskStatus(task);
                                    const StatusIcon = taskStatus.icon;

                                    return (
                                      <div
                                        key={task.id}
                                        className="border-l-4 pl-4"
                                        style={{
                                          borderColor: taskStatus.color.replace(
                                            "text-",
                                            ""
                                          ),
                                        }}
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <h5 className="font-medium">
                                              {task.taskName}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1">
                                              <StatusIcon
                                                className={`w-4 h-4 ${taskStatus.color}`}
                                              />
                                              <span
                                                className={`text-sm ${taskStatus.color}`}
                                              >
                                                {taskStatus.message}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="text-right text-sm text-gray-500">
                                            <div>
                                              Due:{" "}
                                              {new Date(
                                                task.due_date
                                              ).toLocaleDateString()}
                                            </div>
                                            <div>
                                              {task.actualHours}/{task.hours}{" "}
                                              hours
                                            </div>
                                          </div>
                                        </div>

                                        <Progress
                                          value={
                                            (task.actualHours / task.hours) *
                                            100
                                          }
                                          className="h-1.5"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="mt-2 text-sm text-gray-500">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      Completed:{" "}
                                      {
                                        consultantTasks.filter(
                                          (t) => t.status === "completed"
                                        ).length
                                      }
                                    </div>
                                    <div>
                                      In Progress:{" "}
                                      {
                                        consultantTasks.filter(
                                          (t) => t.status === "in progress"
                                        ).length
                                      }
                                    </div>
                                    <div>
                                      At Risk:{" "}
                                      {
                                        consultantTasks.filter(
                                          (t) =>
                                            calculateTaskStatus(t).status ===
                                            "at-risk"
                                        ).length
                                      }
                                    </div>
                                    <div>
                                      Overdue:{" "}
                                      {
                                        consultantTasks.filter(
                                          (t) =>
                                            calculateTaskStatus(t).status ===
                                            "critical"
                                        ).length
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
                <SelectTrigger>
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    {selectedConsultant.username}'s Tasks
                  </h3>
                  {getConsultantTasks(selectedConsultant.id).map((task) => (
                    <div key={task.id} className="mt-2">
                      <p>
                        {task.taskName} (Project:{projectStatusData.name}
                        {projects.find((p) => p.id === task.projectId).name})
                      </p>
                      <p>
                        Allocated Hours: {task.hours}, Actual Hours:
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
                <SelectTrigger>
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
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
                      <div key={project.id} className="mt-4">
                        <h4 className="text-md font-semibold">
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
                  <div className="mt-6">
                    <h4 className="text-md font-semibold">Project Summary</h4>
                    <p>
                      Total Projects:{" "}
                      {
                        getProjectManagerProjects(selectedProjectManager.id)
                          .length
                      }
                    </p>
                    <p>
                      Current Projects:{" "}
                      {
                        getProjectManagerProjects(
                          selectedProjectManager.id
                        ).filter((p) => p.status === "in progress").length
                      }
                    </p>
                    <p>
                      Completed Projects (On Time):{" "}
                      {
                        getProjectManagerProjects(
                          selectedProjectManager.id
                        ).filter(
                          (p) =>
                            p.status === "completed" &&
                            p.actualHours <= p.allocatedHours
                        ).length
                      }
                    </p>
                    <p>
                      Completed Projects (Overtime):{" "}
                      {
                        getProjectManagerProjects(
                          selectedProjectManager.id
                        ).filter(
                          (p) =>
                            p.status === "completed" &&
                            p.actualHours > p.allocatedHours
                        ).length
                      }
                    </p>
                    <p>
                      Completed Projects (Overtime):{" "}
                      {
                        getProjectManagerProjects(
                          selectedProjectManager.id
                        ).filter(
                          (p) =>
                            p.status === "completed" &&
                            p.actualHours > p.allocatedHours
                        ).length
                      }
                    </p>
                    <p>
                      Overdue Projects:{" "}
                      {
                        getProjectManagerProjects(
                          selectedProjectManager.id
                        ).filter(
                          (p) =>
                            new Date(p.dueDate) < new Date() &&
                            p.status !== "completed"
                        ).length
                      }
                    </p>

                    <p>
                      At Risk Projects:{" "}
                      {
                        getProjectManagerProjects(
                          selectedProjectManager.id
                        ).filter((p) => p.status === "at risk").length
                      }
                    </p>
                  </div>
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
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
              <ul className="space-y-2">
                <li>Total Projects: {projects.length}</li>
                <li>
                  On-Track Projects:{" "}
                  {
                    projects.filter((p) => calculateRiskLevel(p) === "Low")
                      .length
                  }
                </li>
                <li>Completed Projects: {completedProjects}</li>
                <li>Overdue Projects: {overdueProjects}</li>
                <li>Over-budget Projects: {overbudgetProjects}</li>
                <li>
                  Average Project Completion:{" "}
                  {((completedProjects / projects.length) * 100).toFixed(2)}%
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Resource Utilization
              </h3>
              <ul className="space-y-2">
                <li>Total Consultants: {consultants.length}</li>
                <li>Total Project Managers: {projectManagers.length}</li>
                <li>
                  Average Resource Utilization:{" "}
                  {(
                    (projects.reduce(
                      (acc, project) =>
                        acc + project.actualHours / project.allocatedHours,
                      0
                    ) /
                      projects.length) *
                    100
                  ).toFixed(2)}
                  %
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ProjectReportDashboard;
