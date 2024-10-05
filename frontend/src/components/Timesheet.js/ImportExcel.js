import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import apiClient from "../../utils/apiClient";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const ExcelImport = () => {
  const [file, setFile] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchImportHistory();
  }, []);

  const fetchImportHistory = async () => {
    try {
      const response = await apiClient.get("/excel/history");
      if (response.ok) {
        const data = await response.json();
        setImportHistory(data);
      }
    } catch (error) {
      console.error("Error fetching import history:", error);
    }
  };

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
    formData.append("excelFile", file);

    try {
      const response = await apiClient.fetch("/excel/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setAlert({
          type: "success",
          message: "Excel file imported successfully.",
        });
        fetchImportHistory();
      } else {
        const errorData = await response.json();
        setAlert({ type: "error", message: errorData.message });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while importing the file.",
      });
    }

    setFile(null);
  };

  console.log("Rendering ExcelImport component");
  console.log("importHistory:", importHistory);

  return (
    <ErrorBoundary>
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

        <h2 className="text-xl font-semibold mb-4">Import History</h2>
        {importHistory.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Task ID</th>
                <th className="border p-2">Task Name</th>
                <th className="border p-2">Project</th>
                <th className="border p-2">Assigned To</th>
                <th className="border p-2">Actual Hours</th>
                <th className="border p-2">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {importHistory.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.taskId}</td>
                  <td className="border p-2">{item.taskName}</td>
                  <td className="border p-2">
                    {item.project?.name} ({item.project?.wbsElement})
                  </td>
                  <td className="border p-2">
                    {item.assignedToUser?.username}
                  </td>
                  <td className="border p-2">{item.actualHours}</td>
                  <td className="border p-2">
                    {new Date(item.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No import history available.</p>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ExcelImport;
