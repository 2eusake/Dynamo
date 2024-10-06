import React, { useState, useEffect } from "react";
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

// Deloitte colors
const colors = {
  primary: "#86BC25",
  secondary: "#0076A8",
  tertiary: "#62B5E5",
  quaternary: "#00A3E0",
  black: "#000000",
  white: "#FFFFFF",
};

// Mock data - replace with actual data fetching logic
const mockProjects = [
  {
    id: 1,
    name: "Project A",
    allocatedHours: 100,
    actualHours: 90,
    status: "completed",
    dueDate: "2024-05-01",
    projectManagerId: 1,
  },
  {
    id: 2,
    name: "Project B",
    allocatedHours: 200,
    actualHours: 220,
    status: "in progress",
    dueDate: "2024-06-15",
    projectManagerId: 1,
  },
  {
    id: 3,
    name: "Project C",
    allocatedHours: 150,
    actualHours: 140,
    status: "not started",
    dueDate: "2024-07-30",
    projectManagerId: 2,
  },
  {
    id: 4,
    name: "Project D",
    allocatedHours: 180,
    actualHours: 200,
    status: "completed",
    dueDate: "2024-04-30",
    projectManagerId: 2,
  },
  {
    id: 5,
    name: "Project E",
    allocatedHours: 120,
    actualHours: 110,
    status: "at risk",
    dueDate: "2024-08-15",
    projectManagerId: 1,
  },
];

const mockTasks = [
  {
    id: 1,
    projectId: 1,
    name: "Task 1",
    allocatedHours: 20,
    actualHours: 18,
    status: "completed",
    consultantId: 1,
  },
  {
    id: 2,
    projectId: 1,
    name: "Task 2",
    allocatedHours: 30,
    actualHours: 35,
    status: "completed",
    consultantId: 2,
  },
  {
    id: 3,
    projectId: 2,
    name: "Task 3",
    allocatedHours: 40,
    actualHours: 45,
    status: "in progress",
    consultantId: 1,
  },
  {
    id: 4,
    projectId: 2,
    name: "Task 4",
    allocatedHours: 50,
    actualHours: 40,
    status: "in progress",
    consultantId: 3,
  },
  {
    id: 5,
    projectId: 3,
    name: "Task 5",
    allocatedHours: 25,
    actualHours: 0,
    status: "not started",
    consultantId: 2,
  },
  {
    id: 6,
    projectId: 4,
    name: "Task 6",
    allocatedHours: 60,
    actualHours: 70,
    status: "completed",
    consultantId: 3,
  },
  {
    id: 7,
    projectId: 5,
    name: "Task 7",
    allocatedHours: 35,
    actualHours: 40,
    status: "at risk",
    consultantId: 1,
  },
];

const mockConsultants = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
];

const mockProjectManagers = [
  { id: 1, name: "Bob Williams" },
  { id: 2, name: "Carol Brown" },
];

const ProjectReportDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedProjectManager, setSelectedProjectManager] = useState(null);

  const overallPerformance = mockProjects.reduce(
    (acc, project) => {
      acc.allocatedHours += project.allocatedHours;
      acc.actualHours += project.actualHours;
      return acc;
    },
    { allocatedHours: 0, actualHours: 0 }
  );

  const projectStatus = mockProjects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const projectStatusData = Object.entries(projectStatus).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const completedProjects = mockProjects.filter(
    (p) => p.status === "completed"
  ).length;
  const overdueProjects = mockProjects.filter(
    (p) => new Date(p.dueDate) < new Date() && p.status !== "completed"
  ).length;
  const overbudgetProjects = mockProjects.filter(
    (p) => p.actualHours > p.allocatedHours
  ).length;

  const getConsultantTasks = (consultantId) => {
    return mockTasks.filter((task) => task.consultantId === consultantId);
  };

  const getProjectManagerProjects = (projectManagerId) => {
    return mockProjects.filter(
      (project) => project.projectManagerId === projectManagerId
    );
  };

  const getProjectTasks = (projectId) => {
    return mockTasks.filter((task) => task.projectId === projectId);
  };

  const getProjectConsultants = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    const consultantIds = [
      ...new Set(projectTasks.map((task) => task.consultantId)),
    ];
    return mockConsultants.filter((consultant) =>
      consultantIds.includes(consultant.id)
    );
  };

  const getTaskStatusSummary = (tasks) => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  };

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
                    mockProjects.find((p) => p.id === parseInt(value))
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
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
                    Project Manager:{" "}
                    {
                      mockProjectManagers.find(
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
                    mockConsultants.find((c) => c.id === parseInt(value))
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a consultant" />
                </SelectTrigger>
                <SelectContent>
                  {mockConsultants.map((consultant) => (
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    {selectedConsultant.name}'s Tasks
                  </h3>
                  {getConsultantTasks(selectedConsultant.id).map((task) => (
                    <div key={task.id} className="mt-2">
                      <p>
                        {task.name} (Project:{" "}
                        {mockProjects.find((p) => p.id === task.projectId).name}
                        )
                      </p>
                      <p>
                        Allocated Hours: {task.allocatedHours}, Actual Hours:{" "}
                        {task.actualHours}
                      </p>
                      <Progress
                        value={(task.actualHours / task.allocatedHours) * 100}
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
                    mockProjectManagers.find((pm) => pm.id === parseInt(value))
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project manager" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjectManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id.toString()}>
                      {manager.name}
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
            <li>Total Projects: {mockProjects.length}</li>
            <li>Completed Projects: {completedProjects}</li>
            <li>Overdue Projects: {overdueProjects}</li>
            <li>Over-budget Projects: {overbudgetProjects}</li>
            <li>Total Consultants: {mockConsultants.length}</li>
            <li>Total Project Managers: {mockProjectManagers.length}</li>
          </ul>
          <p className="mt-4">Key Observations:</p>
          <ul className="list-disc list-inside mt-2">
            <li>
              Overall project completion rate:{" "}
              {((completedProjects / mockProjects.length) * 100).toFixed(2)}%
            </li>
            <li>
              Projects at risk or overdue:{" "}
              {(
                ((overdueProjects +
                  mockProjects.filter((p) => p.status === "at risk").length) /
                  mockProjects.length) *
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
