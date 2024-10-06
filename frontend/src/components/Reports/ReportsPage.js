// export default Reports;
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient"; // Assuming you have this set up for API requests
import { AuthContext } from "../../contexts/AuthContext"; // AuthContext for role and user data
import { ChevronDown, ChevronUp } from "lucide-react"; // Icons for expanding/collapsing
import { Link } from "react-router-dom";
import { Button } from "../UIComp"; // Assuming you have a button component
import { useTheme } from '../../contexts/ThemeContext'; // Import the theme context

const Reports = () => {
  const { user } = useContext(AuthContext); // Get user info from context
  const { isDarkMode, toggleDarkMode } = useTheme(); // Use the theme context
  const [reports, setReports] = useState([]); // For storing report data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReports, setExpandedReports] = useState({});
  const navigate = useNavigate();

  // Fetch reports data based on the user's role
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        let response;
        if (user.role === "Director") {
          response = await apiClient.get("/api/reports/data"); // Fetch all reports for Director
        } else if (user.role === "Project Manager") {
          response = await apiClient.get(`/api/reports/data/manager/${user.id}`); // Fetch reports for Project Manager
        } else {
          response = await apiClient.get(`/api/reports/data/user/${user.id}`); // Fetch reports for regular user
        }
        setReports(response.data); // Set the fetched reports
        setError(null);
      } catch (error) {
        console.error("Failed to load reports:", error);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user]);

  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  if (loading) return <div className="text-center py-4">Loading reports...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className={`mx-auto p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-4">
          {user.role === "Director" ? "All Reports" : "Your Reports"}
        </h3>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports found.</p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg shadow-sm">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => toggleReportExpansion(report.id)}
                >
                  <div>
                    <h4 className="text-lg font-semibold">{report.projectName}</h4>
                    <p className="text-sm text-gray-600">
                      Report Date: {new Date(report.reportDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          report.status === "Completed" ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        {report.status}
                      </span>
                    </p>
                  </div>
                  {expandedReports[report.id] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
                {expandedReports[report.id] && (
                  <div className="p-4 border-t">
                    <h5 className="font-semibold mb-2">Project Overview:</h5>
                    <p className="text-sm">
                      Allocated Hours: {report.allocatedHours} | Actual Hours: {report.actualHours}
                    </p>
                    <p className="text-sm">
                      {report.actualHours > report.allocatedHours ? (
                        <span className="text-red-600 font-semibold">Over Time</span>
                      ) : (
                        <span className="text-green-600 font-semibold">Within Time</span>
                      )}
                    </p>
                    <Link to={`/reports/${report.id}`}>
                      <Button variant="outline" className="mt-2">
                        View Detailed Report
                      </Button>
                    </Link>
                    <h5 className="font-semibold mt-4">Tasks:</h5>
                    {report.tasks && report.tasks.length > 0 ? (
                      <ul className="space-y-2">
                        {report.tasks.map((task) => (
                          <li key={task.id} className="bg-white p-2 rounded border">
                            <div className="flex justify-between items-center">
                              <span>{task.taskName}</span>
                              <Link to={`/tasks/${task.id}`}>
                                <Button variant="outline" className="mt-2">
                                  View Task Details
                                </Button>
                              </Link>
                            </div>
                            <p className="text-sm text-gray-600">
                              Status: {task.status}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No tasks found for this report.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
