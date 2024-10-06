import React, { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
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
  CartesianGrid,
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

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 10, marginTop: 15 },
  text: { fontSize: 12, marginBottom: 5 },
  section: { marginBottom: 15 },
});
const getConsultantTasks = (consultantId, tasksData) => {
  return tasksData.filter((task) => task.assigned_to_user_id === consultantId);
};

// Utility function to get consultants for a specific project
const getProjectConsultants = (projectId, tasksData, consultantsData) => {
  const consultantIds = [
    ...new Set(
      tasksData
        .filter((task) => task.projectId === projectId)
        .map((task) => task.assigned_to_user_id)
    ),
  ];

  return consultantsData.filter((consultant) =>
    consultantIds.includes(consultant.id)
  );
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
  const [currentProjects, setCurrentProjects] = useState(0);
  const getConsultantProjectsLocal = (consultantId) => {
    const consultantTasksLocal = tasks.filter(
      (task) => task.assigned_to_user_id === consultantId
    );
    const projectIds = [
      ...new Set(consultantTasksLocal.map((task) => task.projectId)),
    ];
    return projects.filter((project) => projectIds.includes(project.id));
  };
  const getConsultantProjects = (consultantId) => {
    const consultantTasks = tasks.filter(
      (task) => task.assigned_to_user_id === consultantId
    );
    const projectIds = [
      ...new Set(consultantTasks.map((task) => task.projectId)),
    ];
    return projects.filter((project) => projectIds.includes(project.id));
  };

  const getProjectManagerProjects = (projectManagerId) => {
    return projects.filter(
      (project) => project.projectManagerId === projectManagerId
    );
  };

  const getConsultantPerformanceData = (consultantId) => {
    return getConsultantProjects(consultantId).map((project) => {
      const projectTasks = getConsultantTasks(consultantId).filter(
        (task) => task.projectId === project.id
      );

      return {
        project: project.name,
        allocatedHours: projectTasks.reduce((sum, task) => sum + task.hours, 0),
        actualHours: projectTasks.reduce(
          (sum, task) => sum + task.actualHours,
          0
        ),
      };
    });
  };

  const getProjectManagerPerformanceData = (projectManagerId) => {
    return getProjectManagerProjects(projectManagerId).map((project) => ({
      name: project.name,
      allocatedHours: project.allocatedHours,
      actualHours: project.actualHours,
    }));
  };
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
          throw new Error("Data is not in the expected format");
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

        const currentProjectsCount = projectsRes.data.filter(
          (project) => project.status === "in progress"
        ).length;

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
        setCurrentProjects(currentProjectsCount);
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

  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const overdueProjects = projects.filter(
    (p) => new Date(p.endDate) < new Date() && p.status !== "completed"
  ).length;
  const overbudgetProjects = projects.filter(
    (p) => p.actualHours > p.allocatedHours
  ).length;

  const metrics = projects.reduce(
    (acc, project) => ({
      allocatedHours: acc.allocatedHours + project.allocatedHours,
      actualHours: acc.actualHours + project.actualHours,
    }),
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

  const generateReportData = () => {
    return {
      totalProjects: projects.length,
      completedProjects,
      currentProjects,
      overdueProjects,
      overbudgetProjects,
      totalAllocatedHours: metrics.allocatedHours,
      totalActualHours: metrics.actualHours,
      utilizationRate: (
        (metrics.actualHours / metrics.allocatedHours) *
        100
      ).toFixed(2),
      projectStatus,
      recommendations: [
        "Focus on reducing overdue projects through better timeline management",
        "Improve resource allocation to minimize over-budget projects",
        "Implement regular check-ins for at-risk projects",
        "Consider additional resources for high-demand project managers",
      ],
    };
  };
  const ProjectReport = ({ data }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Project Management Report</Text>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Overall Performance</Text>
            <Text style={styles.text}>
              Total Projects: {data.totalProjects}
            </Text>
            <Text style={styles.text}>
              Completed Projects: {data.completedProjects}
            </Text>
            <Text style={styles.text}>
              Current Projects: {data.currentProjects}
            </Text>
            <Text style={styles.text}>
              Overdue Projects: {data.overdueProjects}
            </Text>
            <Text style={styles.text}>
              Over-budget Projects: {data.overbudgetProjects}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Resource Utilization</Text>
            <Text style={styles.text}>
              Total Allocated Hours: {data.totalAllocatedHours}
            </Text>
            <Text style={styles.text}>
              Total Actual Hours: {data.totalActualHours}
            </Text>
            <Text style={styles.text}>
              Utilization Rate: {data.utilizationRate}%
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Project Status Summary</Text>
            {Object.entries(data.projectStatus).map(([status, count]) => (
              <Text key={status} style={styles.text}>
                {status}: {count}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Key Recommendations</Text>
            {data.recommendations.map((rec, index) => (
              <Text key={index} style={styles.text}>
                • {rec}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return <div className="error-message bg-red-100 p-4 rounded">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-black">
          Project Report Dashboard
        </h1>
        <PDFDownloadLink
          document={<ProjectReport data={generateReportData()} />}
          fileName="project-management-report.pdf"
        >
          {({ blob, url, loading, error }) => (
            <Button variant="outline" className="bg-white hover:bg-gray-100">
              {loading ? "Generating report..." : "Download PDF Report"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white rounded-lg p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="managers">Project Managers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Completed Projects</p>
                    <h3 className="text-2xl font-bold">{completedProjects}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Projects</p>
                    <h3 className="text-2xl font-bold">{currentProjects}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Overdue Projects</p>
                    <h3 className="text-2xl font-bold text-red-500">
                      {overdueProjects}
                    </h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Over-budget Projects
                    </p>
                    <h3 className="text-2xl font-bold text-orange-500">
                      {overbudgetProjects}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[metrics]}>
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

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
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
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card className="bg-white shadow-lg">
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
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedProject.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold">{selectedProject.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-semibold">{selectedProject.dueDate}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2">
                      Hours Overview
                    </h4>
                    <ResponsiveContainer width="100%" height={100}>
                      <BarChart data={[selectedProject]}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="allocatedHours"
                          fill={colors.primary}
                          name="Allocated"
                        />
                        <Bar
                          dataKey="actualHours"
                          fill={colors.secondary}
                          name="Actual"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <h4 className="text-lg font-semibold mt-4 mb-2">
                    Team Members
                  </h4>
                  <div className="space-y-2">
                    {getProjectConsultants(selectedProject.id).map(
                      (consultant) => (
                        <div
                          key={consultant.id}
                          className="p-2 bg-gray-50 rounded"
                        >
                          <p className="font-medium">{consultant.name}</p>
                          <div className="mt-1">
                            {getConsultantTasks(consultant.id)
                              .filter(
                                (task) => task.projectId === selectedProject.id
                              )
                              .map((task) => (
                                <div key={task.id} className="text-sm">
                                  {task.name} - {task.status}
                                  <Progress
                                    value={
                                      (task.actualHours / task.allocatedHours) *
                                      100
                                    }
                                    className="h-1 mt-1"
                                  />
                                </div>
                              ))}
                          </div>
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
          <Card className="bg-white shadow-lg">
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
                      {consultant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedConsultant && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedConsultant.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Projects</p>
                      <p className="text-2xl font-bold">
                        {getConsultantProjects(selectedConsultant.id).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Tasks</p>
                      <p className="text-2xl font-bold">
                        {getConsultantTasks(selectedConsultant.id).length}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">
                      Performance Overview
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={getConsultantPerformanceData(
                          selectedConsultant.id
                        )}
                      >
                        <XAxis dataKey="project" />
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
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Current Projects
                    </h4>
                    {getConsultantProjects(selectedConsultant.id).map(
                      (project) => (
                        <div
                          key={project.id}
                          className="mb-4 p-3 bg-gray-50 rounded"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{project.name}</h5>
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                project.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "in progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {getConsultantTasks(selectedConsultant.id)
                              .filter((task) => task.projectId === project.id)
                              .map((task) => (
                                <div key={task.id} className="text-sm">
                                  <div className="flex justify-between">
                                    <span>{task.name}</span>
                                    <span>
                                      {task.actualHours}/{task.allocatedHours}h
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      (task.actualHours / task.allocatedHours) *
                                      100
                                    }
                                    className="h-1 mt-1"
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Project Manager Overview</CardTitle>
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
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedProjectManager && (
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedProjectManager.name}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Total Projects</p>
                      <p className="text-2xl font-bold">
                        {
                          getProjectManagerProjects(selectedProjectManager.id)
                            .length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          getProjectManagerProjects(
                            selectedProjectManager.id
                          ).filter((p) => p.status === "completed").length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">In Progress</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {
                          getProjectManagerProjects(
                            selectedProjectManager.id
                          ).filter((p) => p.status === "in progress").length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">At Risk</p>
                      <p className="text-2xl font-bold text-red-600">
                        {
                          getProjectManagerProjects(
                            selectedProjectManager.id
                          ).filter((p) => p.status === "at risk").length
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2">
                      Project Performance
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={getProjectManagerPerformanceData(
                          selectedProjectManager.id
                        )}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
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
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Active Projects
                    </h4>
                    {getProjectManagerProjects(selectedProjectManager.id)
                      .filter((project) => project.status !== "completed")
                      .map((project) => (
                        <div
                          key={project.id}
                          className="mb-4 p-3 bg-gray-50 rounded"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{project.name}</h5>
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                project.status === "in progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>Start Date: {project.startDate}</div>
                            <div>Due Date: {project.dueDate}</div>
                          </div>
                          <Progress
                            value={
                              (project.actualHours / project.allocatedHours) *
                              100
                            }
                            className="h-2"
                          />
                          <div className="mt-2 text-sm text-gray-600">
                            {project.actualHours}/{project.allocatedHours} hours
                            used
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Overall Summary */}
      <Card className="mt-8 bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Overall Dashboard Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>
              This dashboard provides a comprehensive overview of project
              performance across the organization:
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>Total Projects: {projects.length}</li>
              <li>Completed Projects: {completedProjects}</li>
              <li>Current Projects: {currentProjects}</li>
              <li>Overdue Projects: {overdueProjects}</li>
              <li>Over-budget Projects: {overbudgetProjects}</li>
              <li>Total Consultants: {consultants.length}</li>
              <li>Total Project Managers: {projectManagers.length}</li>
            </ul>
            <p className="mt-4 font-medium">Key Observations:</p>
            <ul className="list-disc list-inside mt-2">
              <li>
                Overall project completion rate:{" "}
                {((completedProjects / projects.length) * 100).toFixed(2)}%
              </li>
              <li>
                Projects at risk or overdue:{" "}
                {(
                  ((overdueProjects +
                    projects.filter((p) => p.status === "at risk").length) /
                    projects.length) *
                  100
                ).toFixed(2)}
                %
              </li>
              <li>
                Resource utilization:{" "}
                {((metrics.actualHours / metrics.allocatedHours) * 100).toFixed(
                  2
                )}
                %
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Utility functions

export default ProjectReportDashboard;
