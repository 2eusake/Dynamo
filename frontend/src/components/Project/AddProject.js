import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects",
        { name: projectName, description, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Project ${projectName} created successfully!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating project", error);
      alert("Error creating project");
    }
  };

  return (
    <div className="add-project p-4">
      <h1 className="text-2xl mb-4">Add Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2">
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border p-1"
          />
        </label>
        <label className="mb-2">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1"
          />
        </label>
        <label className="mb-2">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-1"
          />
        </label>
        <label className="mb-2">
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-1"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddProject;
