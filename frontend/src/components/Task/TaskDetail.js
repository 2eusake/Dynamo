/*import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '../../contexts/ProjectContext';

const TaskDetail = () => {
  const { id } = useParams();
  const { projects } = useContext(ProjectContext);
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    projects.forEach(project => {
      const foundTask = project.tasks.find(task => task.id === parseInt(id, 10));
      if (foundTask) setTask(foundTask);
    });
  }, [id, projects]);

  if (!task) {
    return <p className="text-deloitte-black">Loading task details...</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-4 text-deloitte-blue">Task: {task.name}</h2>
      <p className="text-xl text-deloitte-black mb-6">
        {task.description || 'No description available'}
      </p>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-semibold text-deloitte-black">Progress</span>
          <span className="text-xl font-semibold text-deloitte-black">{task.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-deloitte-green h-4 rounded-full"
            style={{ width: `${task.progress || 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;*/

import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TaskContext } from "../../contexts/TaskContext";
import { UserContext } from "../../contexts/UserContext"; // Assume we have a UserContext
import { Card, CardHeader, CardTitle, CardContent, Button } from "./UIComp";
import { UserCircle, Calendar, Clock, FileText, Briefcase } from "lucide-react";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const { tasks } = useContext(TaskContext);
  const { getUser } = useContext(UserContext); // Assume we have a getUser function in UserContext
  const [task, setTask] = useState(null);
  const [assignedUser, setAssignedUser] = useState(null);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id && t.id.toString() === taskId);
    setTask(foundTask);

    if (foundTask && foundTask.assigned_to_user_id) {
      getUser(foundTask.assigned_to_user_id).then((users) =>
        setAssignedUser(users)
      );
    }
  }, [taskId, tasks, getUser]);

  if (!task) {
    return (
      <div className="container mx-auto p-4">
        <Link
          to="/tasks"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Back to Tasks
        </Link>
        <Card className="mt-4">
          <CardContent>
            <p className="text-gray-600">Task not found or still loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress =
    task.actualHours && task.hours
      ? Math.min(100, Math.round((task.actualHours / task.hours) * 100))
      : 0;

  const statusColors = {
    "In Progress": "bg-yellow-500",
    Completed: "bg-green-500",
    "Not Started": "bg-red-500",
    default: "bg-gray-500",
  };

  const statusColor = statusColors[task.status] || statusColors.default;

  return (
    <div className="container mx-auto p-4">
      <Link
        to="/tasks"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Tasks
      </Link>
      <Card className="mt-4">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            {task.taskName || "Unnamed Task"}
          </CardTitle>
          <div
            className={`${statusColor} text-white px-3 py-1 rounded-full text-sm`}
          >
            {task.status || "Unknown"}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <FileText className="mr-2 text-gray-500" />
                <span className="font-semibold">Description:</span>
                <p className="ml-2">
                  {task.description || "No description available"}
                </p>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-500" />
                <span className="font-semibold">Start Date:</span>
                <span className="ml-2">{task.start_date || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-500" />
                <span className="font-semibold">Due Date:</span>
                <span className="ml-2">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-500" />
                <span className="font-semibold">Hours Allocated:</span>
                <span className="ml-2">{task.hours || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-500" />
                <span className="font-semibold">Actual Hours Spent:</span>
                <span className="ml-2">{task.actualHours || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <UserCircle className="mr-2 text-gray-500" />
                <span className="font-semibold">Assigned To:</span>
                <span className="ml-2">
                  {assignedUser ? assignedUser.userName : "Loading..."}
                </span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-2 text-gray-500" />
                <span className="font-semibold">Project ID:</span>
                <span className="ml-2">{task.project_id || "Unassigned"}</span>
              </div>
              <div className="mt-4">
                <span className="font-semibold">Progress:</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {progress}% Complete
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetailsPage;
