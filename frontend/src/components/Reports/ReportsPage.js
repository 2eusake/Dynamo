import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
} from "./UIComponents";
import { Progress } from "./UIComponents";
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

const ProjectReportDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
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
            (sum, task) => sum + (task.hours || 0),
            0
          );
          const actualHours = projectTasks.reduce(
            (sum, task) => sum + (task.actualHours || 0),
            0
          );
          return { ...project, allocatedHours, actualHours };
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

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-black">
        Project Report Dashboard
      </h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="managers">Project Managers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[overallPerformance]}>
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
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Completed Projects: {completedProjects}</li>
                  <li>Overdue Projects: {overdueProjects}</li>
                  <li>Over-budget Projects: {overbudgetProjects}</li>
                </ul>
              </CardContent>
            </Card>
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    {selectedProject.name}
                  </h3>
                  <p>Status: {selectedProject.status}</p>
                  <p>Allocated Hours: {selectedProject.allocatedHours}</p>
                  <p>Actual Hours: {selectedProject.actualHours}</p>
                  <p>Due Date: {selectedProject.dueDate}</p>
                  <p>
                    Project Manager:{projectManagers.username}
                    {
                      projectManagers.find(
                        (pm) => pm.id === selectedProject.projectManagerId
                      )?.name
                    }
                  </p>

                  <h4 className="text-md font-semibold mt-4">
                    Consultants and Tasks:
                  </h4>
                  {getProjectConsultants(selectedProject.id).map(
                    (consultant) => {
                      const consultantTasks = getConsultantTasks(
                        consultant.id
                      ).filter((task) => task.projectId === selectedProject.id);
                      return (
                        <div key={consultant.id} className="mt-2">
                          <p>{consultant.name}</p>
                          <ul>
                            {consultantTasks.map((task) => (
                              <li key={task.id}>
                                {task.name} - Allocated: {task.allocatedHours}h,
                                Actual: {task.actualHours}h, Status:{" "}
                                {task.status}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  )}

                  <h4 className="text-md font-semibold mt-4">Task Summary:</h4>
                  {Object.entries(
                    getTaskStatusSummary(getProjectTasks(selectedProject.id))
                  ).map(([status, count]) => (
                    <p key={status}>
                      {status}: {count}
                    </p>
                  ))}

                  <h4 className="text-md font-semibold mt-4">Conclusion:</h4>
                  <p>
                    Project {selectedProject.name} is currently{" "}
                    {selectedProject.status}.
                    {selectedProject.actualHours >
                    selectedProject.allocatedHours
                      ? " It has exceeded the allocated hours, which may indicate challenges in estimation or scope creep."
                      : " It is currently within the allocated hours, suggesting good planning and execution."}
                    {new Date(selectedProject.dueDate) < new Date() &&
                    selectedProject.status !== "completed"
                      ? " The project has passed its due date and requires immediate attention."
                      : " The project is on track regarding its timeline."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultants">
          <Card>
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
                    {selectedConsultant.name}'s Tasks
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
                    {selectedProjectManager.name}'s Projects
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
                        <p>Due Date: {project.dueDate}</p>
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Overall Dashboard Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This dashboard provides a comprehensive overview of project
            performance across the organization:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Total Projects: {projects.length}</li>
            <li>Completed Projects: {completedProjects}</li>
            <li>Overdue Projects: {overdueProjects}</li>
            <li>Over-budget Projects: {overbudgetProjects}</li>
            <li>Total Consultants: {consultants.length}</li>
            <li>Total Project Managers: {projectManagers.length}</li>
          </ul>
          <p className="mt-4">Key Observations:</p>
          <ul className="list-disc list-inside mt-2">
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
          <p className="mt-4">
            This dashboard allows for detailed analysis of project performance,
            consultant productivity, and project manager effectiveness. Use the
            tabs to dive deeper into specific areas and identify trends,
            challenges, and opportunities for improvement in project management
            practices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default ProjectReportDashboard;
