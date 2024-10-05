// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../contexts/AuthContext'; // Importing AuthContext

// // Mock Data (replace with actual data fetched from your backend)
// const mockProjects = [
//   {
//     id: 1,
//     name: 'Project A',
//     allocatedHours: 100,
//     actualHours: 80,
//     status: 'In Progress',
//     riskOfOvertime: false,
//     description: 'This is a detailed description of Project A.',
//     projectManager: 'John Doe',
//     startDate: '2024-01-10',
//     endDate: '2024-06-15',
//     tasks: [
//       { id: 1, title: 'Task 1', allocatedHours: 20, actualHours: 18, status: 'Completed' },
//       { id: 2, title: 'Task 2', allocatedHours: 30, actualHours: 25, status: 'In Progress' },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Project B',
//     allocatedHours: 150,
//     actualHours: 160,
//     status: 'Completed',
//     riskOfOvertime: true,
//     description: 'This is a detailed description of Project B.',
//     projectManager: 'Jane Smith',
//     startDate: '2023-09-05',
//     endDate: '2024-03-30',
//     tasks: [
//       { id: 3, title: 'Task 1', allocatedHours: 50, actualHours: 60, status: 'Completed' },
//       { id: 4, title: 'Task 2', allocatedHours: 40, actualHours: 50, status: 'Completed' },
//     ],
//   },
// ];

// const Reports = () => {
//   const { user } = useContext(AuthContext); // Access the AuthContext here
//   const [projects, setProjects] = useState([]);
//   const [expandedProjectId, setExpandedProjectId] = useState(null); // Track the expanded project

//   useEffect(() => {
//     // Fetch the projects and tasks from the backend
//     setProjects(mockProjects); // Using mock data for now
//   }, []);

//   const calculateTimeStatus = (allocated, actual) => {
//     return actual <= allocated ? 'Within Time' : 'Over Time';
//   };

//   const toggleProjectDetails = (projectId) => {
//     setExpandedProjectId(expandedProjectId === projectId ? null : projectId); // Toggle expanded state
//   };

//   // Authorization logic: Allow only specific roles to access the Reports page
//   if (!user || (user.role !== 'Director' && user.role !== 'Project Manager')) {
//     return (
//       <div>
//         <h2>Access Denied</h2>
//         <p>You do not have permission to view this page.</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Project and Task Reports</h1>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Project Name</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Allocated Hours</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actual Hours</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time Status</th>
//             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Risk of Overtime</th>
//           </tr>
//         </thead>
//         <tbody>
//           {projects.map((project) => (
//             <React.Fragment key={project.id}>
//               <tr onClick={() => toggleProjectDetails(project.id)} style={{ cursor: 'pointer' }}>
//                 <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
//                   {project.name} {expandedProjectId === project.id ? '▼' : '▶'}
//                 </td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.allocatedHours}</td>
//                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.actualHours}</td>
//                 <td
//                   style={{
//                     border: '1px solid #ddd',
//                     padding: '8px',
//                     color: project.actualHours > project.allocatedHours ? 'red' : 'green',
//                   }}
//                 >
//                   {calculateTimeStatus(project.allocatedHours, project.actualHours)}
//                 </td>
//                 <td
//                   style={{
//                     border: '1px solid #ddd',
//                     padding: '8px',
//                     color: project.riskOfOvertime ? 'orange' : 'green',
//                   }}
//                 >
//                   {project.riskOfOvertime ? 'At Risk' : 'On Track'}
//                 </td>
//               </tr>

//               {/* Project Details and Task Report (conditionally rendered) */}
//               {expandedProjectId === project.id && (
//                 <>
//                   <tr>
//                     <td colSpan="5" style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
//                       <strong>Project Details:</strong>
//                       <p>{project.description}</p>
//                       <p>
//                         <strong>Project Manager:</strong> {project.projectManager}
//                       </p>
//                       <p>
//                         <strong>Start Date:</strong> {project.startDate} | <strong>End Date:</strong> {project.endDate}
//                       </p>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td colSpan="5">
//                       <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
//                         <thead>
//                           <tr>
//                             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Task Name</th>
//                             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Allocated Hours</th>
//                             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actual Hours</th>
//                             <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {project.tasks?.length > 0 ? (
//                             project.tasks.map((task) => (
//                               <tr key={task.id}>
//                                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.title}</td>
//                                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.allocatedHours}</td>
//                                 <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.actualHours}</td>
//                                 <td
//                                   style={{
//                                     border: '1px solid #ddd',
//                                     padding: '8px',
//                                     color: task.actualHours > task.allocatedHours ? 'red' : 'green',
//                                   }}
//                                 >
//                                   {calculateTimeStatus(task.allocatedHours, task.actualHours)}
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="4" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
//                                 No tasks available
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 </>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Reports;
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient"; // Assuming you have this set up for API requests
import { AuthContext } from "../../contexts/AuthContext"; // AuthContext for role and user data
import { ChevronDown, ChevronUp } from "lucide-react"; // Icons for expanding/collapsing
import { Link } from "react-router-dom";
import { Button } from "../Task/UIComp"; // Assuming you have a button component
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
