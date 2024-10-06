// src/components/TaskDetailsPage.js

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Textarea,
} from "../UIComp";
import {
  UserCircle,
  Calendar,
  Clock,
  FileText,
  Briefcase,
  Edit,
  MessageSquare,
} from "lucide-react";

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null); // State to hold project data
  const [assignedUser, setAssignedUser] = useState(null);
  const [consultants, setConsultants] = useState([]); // Consultants state
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await apiClient.get(`/tasks/${taskId}`);
        const fetchedTask = response.data;
        setTask(fetchedTask);
        setEditedTask(fetchedTask);
        setAssignedUser(fetchedTask.assignedToUser);
        
        // Fetch associated project to get WBS Element
        if (fetchedTask.project_id) {
          const projectResponse = await apiClient.get(`/projects/${fetchedTask.project_id}`);
          setProject(projectResponse.data);
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    const fetchConsultants = async () => {
      try {
        const response = await apiClient.get(`/users/role/Consultant`);
        setConsultants(response.data);
      } catch (error) {
        console.error("Error fetching consultants:", error);
      }
    };

    fetchTaskDetails();
    fetchConsultants();
  }, [taskId]);

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

  // Calculate progress
  const progress =
    task.actualHours && task.hours
      ? Math.min(100, Math.round((task.actualHours / task.hours) * 100))
      : 0;

  const statusColors = {
    "In Progress": "bg-yellow-500",
    Completed: "bg-green-500",
    "Not Started": "bg-red-500",
    Pending: "bg-orange-500",
    default: "bg-gray-500",
  };

  const statusColor = statusColors[task.status] || statusColors.default;

  const daysUntilDue = task.due_date
    ? Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...editedTask,
        status: editedTask.status, // Ensure status is included
      };
      const response = await apiClient.put(`/tasks/${taskId}`, updateData);
      setTask(response.data);
      setAssignedUser(response.data.assignedToUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
      // Optionally, set an error state here to display to the user
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setEditedTask({ ...editedTask, status: newStatus });
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        user: "Current User", // Replace with actual user name
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4">
      {/* Back to Tasks Link */}
      <Link
        to="/tasks"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Tasks
      </Link>
      <Card className="mt-4">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            {isEditing ? (
              <Input
                name="taskName"
                value={editedTask.taskName}
                onChange={handleChange}
                className="text-2xl font-bold"
              />
            ) : (
              task.taskName || "Unnamed Task"
            )}
          </CardTitle>
          <div className="flex items-center">
            <div
              className={`${statusColor} text-white px-3 py-1 rounded-full text-sm mr-2`}
            >
              {task.status || "Unknown"}
            </div>
            {!isEditing && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Description */}
              <div className="flex items-start">
                <FileText className="mr-2 text-gray-500 mt-1" />
                <div>
                  <span className="font-semibold">Description:</span>
                  {isEditing ? (
                    <Textarea
                      name="description"
                      value={editedTask.description}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  ) : (
                    <p className="ml-2">
                      {task.description || "No description available"}
                    </p>
                  )}
                </div>
              </div>
              {/* Start Date */}
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-500" />
                <span className="font-semibold">Start Date:</span>
                {isEditing ? (
                  <Input
                    type="date"
                    name="start_date"
                    value={editedTask.start_date ? editedTask.start_date.split('T')[0] : ""}
                    onChange={handleChange}
                    className="ml-2"
                  />
                ) : (
                  <span className="ml-2">{formatDate(task.start_date)}</span>
                )}
              </div>
              {/* Due Date */}
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-500" />
                <span className="font-semibold">Due Date:</span>
                {isEditing ? (
                  <Input
                    type="date"
                    name="due_date"
                    value={editedTask.due_date ? editedTask.due_date.split('T')[0] : ""}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, due_date: e.target.value })
                    }
                    className="ml-2"
                  />
                ) : (
                  <span className="ml-2">{formatDate(task.due_date)}</span>
                )}
              </div>
              {daysUntilDue !== null && (
                <div className="text-sm italic">
                  {daysUntilDue > 0
                    ? `${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""} left until due date`
                    : daysUntilDue === 0
                    ? "Due today!"
                    : `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? "s" : ""}`}
                </div>
              )}
              {/* Hours Allocated */}
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-500" />
                <span className="font-semibold">Hours Allocated:</span>
                {isEditing ? (
                  <Input
                    type="number"
                    name="hours"
                    value={editedTask.hours}
                    onChange={handleChange}
                    className="ml-2 w-20"
                  />
                ) : (
                  <span className="ml-2">{task.hours || "N/A"}</span>
                )}
              </div>
              {/* Actual Hours Spent */}
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-500" />
                <span className="font-semibold">Actual Hours Spent:</span>
                {isEditing ? (
                  <Input
                    type="number"
                    name="actualHours"
                    value={editedTask.actualHours}
                    onChange={handleChange}
                    className="ml-2 w-20"
                  />
                ) : (
                  <span className="ml-2">{task.actualHours || "N/A"}</span>
                )}
              </div>
              {task.actualHours > task.hours && (
                <div className="text-red-500 text-sm italic">
                  Warning: Actual hours exceed allocated hours!
                </div>
              )}
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              {/* Assigned To */}
              <div className="flex items-center">
                <UserCircle className="mr-2 text-gray-500" />
                <span className="font-semibold">Assigned To:</span>
                {isEditing ? (
                  <select
                    name="assigned_to_user_id"
                    value={editedTask.assigned_to_user_id || ""}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        assigned_to_user_id: e.target.value,
                      })
                    }
                    className="ml-2 border rounded px-2 py-1"
                  >
                    <option value="">Unassigned</option>
                    {consultants.map((consultant) => (
                      <option key={consultant.id} value={consultant.id}>
                        {consultant.username}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="ml-2">
                    {assignedUser ? assignedUser.username : "Unassigned"}
                  </span>
                )}
              </div>
              {/* WBS Element */}
              <div className="flex items-center">
                <Briefcase className="mr-2 text-gray-500" />
                <span className="font-semibold">WBS Element:</span>
                <span className="ml-2">{project ? project.wbsElement : "Unassigned"}</span>
              </div>
              {/* Progress */}
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
              {progress >= 50 && progress < 100 && (
                <div className="text-yellow-600 text-sm italic">
                  You're halfway there! Keep up the good work!
                </div>
              )}
              {progress === 100 && (
                <div className="text-green-600 text-sm italic">
                  Task completed! Great job!
                </div>
              )}
              {/* Status Editing */}
              {isEditing && (
                <div className="mt-4">
                  <span className="font-semibold">Status:</span>
                  <select
                    name="status"
                    value={editedTask.status || ""}
                    onChange={handleStatusChange}
                    className="ml-2 border rounded px-2 py-1"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          {/* Save and Cancel Buttons */}
          {isEditing && (
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTask(task); // Reset edits
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-green-500 text-white">
                Save Changes
              </Button>
            </div>
          )}
          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-100 p-3 rounded">
                  <p className="font-semibold">{c.user}</p>
                  <p>{c.text}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(c.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow mr-2"
              />
              <Button onClick={handleCommentSubmit}>
                <MessageSquare className="w-4 h-4 mr-2" /> Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetailsPage;
