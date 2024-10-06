import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./UIComponents";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./UIComponents";
import { Badge } from "./UIComponents";

const CategoryModal = ({
  isOpen,
  category,
  projects,
  tasks,
  onClose,
  isDarkMode = false,
}) => {
  const navigate = useNavigate();

  const calculateProgress = (project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    if (projectTasks.length === 0) return 0;

    const totalAllocatedHours = projectTasks.reduce(
      (sum, task) => sum + task.allocatedHours,
      0
    );
    const totalActualHours = projectTasks.reduce(
      (sum, task) => sum + task.actualHours,
      0
    );

    return totalAllocatedHours > 0
      ? Math.round((totalActualHours / totalAllocatedHours) * 100)
      : 0;
  };

  const getCompletedTasksCount = (project) => {
    return tasks.filter(
      (task) => task.projectId === project.id && task.status === "completed"
    ).length;
  };

  const getTotalTasksCount = (project) => {
    return tasks.filter((task) => task.projectId === project.id).length;
  };

  const renderCurrentProjects = () => (
    <Accordion type="single" collapsible className="w-full">
      {projects.map((project) => (
        <AccordionItem key={project.id} value={`project-${project.id}`}>
          <AccordionTrigger
            onClick={() => navigate(`/projects/${project.id}`)}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
          >
            <div className="flex justify-between w-full items-center">
              <span>{project.name}</span>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    calculateProgress(project) >= 100 ? "success" : "default"
                  }
                >
                  {calculateProgress(project)}% Complete
                </Badge>
                <Badge variant="secondary">
                  {getCompletedTasksCount(project)}/
                  {getTotalTasksCount(project)} Tasks
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
        </AccordionItem>
      ))}
    </Accordion>
  );

  const renderUpcomingProjects = () => (
    <div className="space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => navigate(`/projects/${project.id}`)}
          className="flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
        >
          <span>{project.name}</span>
          <Badge variant="outline">
            Starts: {new Date(project.startDate).toLocaleDateString()}
          </Badge>
        </div>
      ))}
    </div>
  );

  const renderOverdueProjects = () => (
    <Accordion type="single" collapsible className="w-full">
      {projects.map((project) => {
        const incompleteTasks = tasks.filter(
          (task) => task.projectId === project.id && task.status !== "completed"
        );

        return (
          <AccordionItem key={project.id} value={`project-${project.id}`}>
            <AccordionTrigger
              onClick={() => navigate(`/projects/${project.id}`)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
            >
              <div className="flex justify-between w-full items-center">
                <span>{project.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">
                    Due: {new Date(project.endDate).toLocaleDateString()}
                  </Badge>
                  <Badge variant="secondary">
                    {getCompletedTasksCount(project)}/
                    {getTotalTasksCount(project)} Tasks
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4 space-y-2">
                {incompleteTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center"
                  >
                    <span>{task.name}</span>
                    <Badge>{task.assignedTo}</Badge>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );

  const debugTasks = (taskList) => {
    console.log("Tasks being filtered:", taskList.length);
    taskList.forEach((task) => {
      console.log(`Task ${task.id}: ${task.name}`, {
        actualHours: task.actualHours,
        allocatedHours: task.allocatedHours,
        dueDate: task.dueDate,
        status: task.status,
      });
    });
  };

  const isTaskAgent = (task) => {
    const isOverAllocated = task.actualHours > task.allocatedHours;
    const isOverdue = new Date(task.dueDate) < new Date();
    const isNotCompleted = task.status !== "completed";

    return isNotCompleted && (isOverAllocated || isOverdue);
  };

  const getAgentProjects = () => {
    debugTasks(tasks); // Debug log

    return projects.filter((project) => {
      const projectTasks = tasks.filter(
        (task) => task.projectId === project.id
      );
      const agentTasks = projectTasks.filter(isTaskAgent);

      console.log(`Project ${project.id}: ${project.name}`, {
        totalTasks: projectTasks.length,
        agentTasks: agentTasks.length,
      });

      return agentTasks.length > 0;
    });
  };

  const renderAgentProjects = () => {
    const agentProjects = getAgentProjects();

    if (agentProjects.length === 0) {
      return <p className="text-center py-4">No agent projects found.</p>;
    }

    return (
      <Accordion>
        {agentProjects.map((project) => {
          const agentTasks = tasks.filter(
            (task) => task.projectId === project.id && isTaskAgent(task)
          );

          return (
            <AccordionItem key={project.id}>
              <AccordionTrigger>
                <div className="flex justify-between w-full items-center">
                  <span>{project.name}</span>
                  <Badge variant="destructive" isDarkMode={isDarkMode}>
                    {agentTasks.length} Problem Tasks
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-4 space-y-2">
                  {agentTasks.map((task) => {
                    const isOverdue = new Date(task.dueDate) < new Date();
                    const overTime = task.actualHours - task.allocatedHours;
                    const overDueDays = isOverdue
                      ? Math.ceil(
                          (new Date() - new Date(task.dueDate)) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0;

                    return (
                      <div
                        key={task.id}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <span>{task.name}</span>
                        <div className="space-x-2">
                          <Badge isDarkMode={isDarkMode}>
                            {task.assignedTo}
                          </Badge>
                          {overTime > 0 && (
                            <Badge variant="warning" isDarkMode={isDarkMode}>
                              +{overTime}h over allocated
                            </Badge>
                          )}
                          {isOverdue && (
                            <Badge
                              variant="destructive"
                              isDarkMode={isDarkMode}
                            >
                              {overDueDays}d overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };
  const renderContent = () => {
    switch (category) {
      case "Current Projects":
        return renderCurrentProjects();
      case "Upcoming Projects":
        return renderUpcomingProjects();
      case "Overdue Projects":
        return renderOverdueProjects();
      case "Agent Projects":
        return renderAgentProjects();
      default:
        return <p>No content available for this category.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card
        className={`w-3/4 max-h-[80vh] overflow-hidden ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <CardHeader className="sticky top-0 z-10 bg-inherit">
          <div className="flex justify-between items-center">
            <CardTitle>{category}</CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              Close
            </button>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto max-h-[calc(80vh-100px)]">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryModal;
