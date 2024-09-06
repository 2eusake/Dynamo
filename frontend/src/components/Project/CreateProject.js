import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    projectManagerId: "",
    currentTask: {
      name: "",
      dueDate: "",
      startDate: "",
      duration: "",
      assignedToId: "",
      assignedToName: "",
    },
    tasks: [],
  });

  const [consultants, setConsultants] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const users = response.data;
        setConsultants(users.filter((user) => user.role === "consultant"));
        setProjectManagers(
          users.filter((user) => user.role === "projectManager")
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTaskChange = (field, value) => {
    setFormData({
      ...formData,
      currentTask: { ...formData.currentTask, [field]: value },
    });
  };

  const handleConsultantChange = (e) => {
    const consultantId = e.target.value;
    const selectedConsultant = consultants.find(
      (consultant) => consultant.id === parseInt(consultantId)
    );
    setFormData({
      ...formData,
      currentTask: {
        ...formData.currentTask,
        assignedToId: consultantId,
        assignedToName: selectedConsultant?.username || "",
      },
    });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [...formData.tasks, formData.currentTask],
      currentTask: {
        name: "",
        dueDate: "",
        startDate: "",
        duration: "",
        assignedToId: "",
        assignedToName: "",
      },
    });
  };

  const removeTask = (index) => {
    const newTasks = formData.tasks.filter((_, idx) => idx !== index);
    setFormData({ ...formData, tasks: newTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/projects", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotification("Project created successfully!");
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        projectManagerId: "",
        currentTask: {
          name: "",
          dueDate: "",
          startDate: "",
          duration: "",
          assignedToId: "",
          assignedToName: "",
        },
        tasks: [],
      });
    } catch (error) {
      console.error("Error creating project:", error);
      setNotification("Failed to create project.");
    }
  };

  return (
    <div className="create-project-container p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Create New Project
      </h2>
      {notification && (
        <div className="notification text-red-500 mb-4">{notification}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Project Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter project name"
            required
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Project Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter project description"
            required
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Start Date:
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              End Date:
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-lg w-full p-2 mb-4"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Project Manager:
          </label>
          <select
            name="projectManagerId"
            value={formData.projectManagerId}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-lg w-full p-2 mb-4"
          >
            <option value="">Select Project Manager</option>
            {projectManagers.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.username}
              </option>
            ))}
          </select>
        </div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Tasks</h3>
        <div className="task-container grid grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Task Name:
            </label>
            <input
              type="text"
              value={formData.currentTask.name}
              onChange={(e) => handleTaskChange("name", e.target.value)}
              placeholder="Enter task name"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Due Date:
            </label>
            <input
              type="date"
              value={formData.currentTask.dueDate}
              onChange={(e) => handleTaskChange("dueDate", e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Start Date:
            </label>
            <input
              type="date"
              value={formData.currentTask.startDate}
              onChange={(e) => handleTaskChange("startDate", e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Duration (Hours):
            </label>
            <input
              type="number"
              value={formData.currentTask.duration}
              onChange={(e) => handleTaskChange("duration", e.target.value)}
              placeholder="Duration"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Assign to Consultant:
            </label>
            <select
              value={formData.currentTask.assignedToId}
              onChange={handleConsultantChange}
              className="border border-gray-300 rounded-lg p-2"
            >
              <option value="">Select Consultant</option>
              {consultants.map((consultant) => (
                <option
                  key={consultant.assignedToName}
                  value={consultant.assignedToName}
                >
                  {consultant.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={addTask}
          className="bg-green-500 text-white p-2 rounded-lg mb-4"
        >
          Add Task to List
        </button>
        <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">
          Allocated Tasks
        </h3>
        {formData.tasks.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Task Name</th>
                <th className="py-2 px-4 border-b">Due Date</th>
                <th className="py-2 px-4 border-b">Start Date</th>
                <th className="py-2 px-4 border-b">Duration</th>
                <th className="py-2 px-4 border-b">Consultant</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.tasks.map((task, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{task.name}</td>
                  <td className="py-2 px-4 border-b">{task.dueDate}</td>
                  <td className="py-2 px-4 border-b">{task.startDate}</td>
                  <td className="py-2 px-4 border-b">{task.duration}</td>
                  <td className="py-2 px-4 border-b">{task.assignedToName}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="bg-red-500 text-white p-1 rounded-lg"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700">No tasks added yet.</p>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg mt-4"
        >
          Save Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
