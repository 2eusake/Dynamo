import React, { useState } from "react";
import { Upload } from "lucide-react";
import apiClient from "../../utils/apiClient";
import './Timesheet.css';

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
    formData.append("file", file);

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
    <div className="page-container">
      <div className="timesheet-container">
        <div className="timesheet-content">
          <h1 className="timesheet-title  underline-green">Excel Import</h1>

          {alert && (
            <div className={`timesheet-alert ${alert.type}`}>
              <p className="alert-title">
                {alert.type === "error" ? "Error" : "Success"}
              </p>
              <p>{alert.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="timesheet-form">
            <div className="timesheet-input-group">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                className="timesheet-file-input"
              />
              <button
                type="submit"
                className="timesheet-submit-button"
              >
                <Upload className="timesheet-icon" /> Import Excel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExcelImport;