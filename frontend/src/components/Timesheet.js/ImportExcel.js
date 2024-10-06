import React, { useState } from "react";
import { Upload } from "lucide-react";
import apiClient from "../../utils/apiClient";

const ExcelImport = () => {
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setAlert({ type: "error", message: "Please select a file to upload." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Use "file" as the key, as expected by the backend

    try {
      const response = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Include authentication token if required
          // "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAlert({
          type: "success",
          message: "Excel file imported successfully.",
        });
      } else {
        setAlert({ type: "error", message: response.data.message });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setAlert({
        type: "error",
        message: "An error occurred while importing the file.",
      });
    }

    setFile(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Excel Import</h1>

      {alert && (
        <div
          className={`p-4 mb-4 rounded ${
            alert.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          <p className="font-bold">
            {alert.type === "error" ? "Error" : "Success"}
          </p>
          <p>{alert.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" /> Import Excel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExcelImport;
