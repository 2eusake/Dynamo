// import React, { useState, useEffect } from 'react';

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
//   // More project data...
// ];

// const Reports = () => {
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
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'; // Importing AuthContext

// Mock Data (replace with actual data fetched from your backend)
const mockProjects = [
  {
    id: 1,
    name: 'Project A',
    allocatedHours: 100,
    actualHours: 80,
    status: 'In Progress',
    riskOfOvertime: false,
    description: 'This is a detailed description of Project A.',
    projectManager: 'John Doe',
    startDate: '2024-01-10',
    endDate: '2024-06-15',
    tasks: [
      { id: 1, title: 'Task 1', allocatedHours: 20, actualHours: 18, status: 'Completed' },
      { id: 2, title: 'Task 2', allocatedHours: 30, actualHours: 25, status: 'In Progress' },
    ],
  },
  {
    id: 2,
    name: 'Project B',
    allocatedHours: 150,
    actualHours: 160,
    status: 'Completed',
    riskOfOvertime: true,
    description: 'This is a detailed description of Project B.',
    projectManager: 'Jane Smith',
    startDate: '2023-09-05',
    endDate: '2024-03-30',
    tasks: [
      { id: 3, title: 'Task 1', allocatedHours: 50, actualHours: 60, status: 'Completed' },
      { id: 4, title: 'Task 2', allocatedHours: 40, actualHours: 50, status: 'Completed' },
    ],
  },
];

const Reports = () => {
  const { user } = useContext(AuthContext); // Access the AuthContext here
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null); // Track the expanded project

  useEffect(() => {
    // Fetch the projects and tasks from the backend
    setProjects(mockProjects); // Using mock data for now
  }, []);

  const calculateTimeStatus = (allocated, actual) => {
    return actual <= allocated ? 'Within Time' : 'Over Time';
  };

  const toggleProjectDetails = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId); // Toggle expanded state
  };

  // Authorization logic: Allow only specific roles to access the Reports page
  if (!user || (user.role !== 'Director' && user.role !== 'Project Manager')) {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Project and Task Reports</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Project Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Allocated Hours</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actual Hours</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Risk of Overtime</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <React.Fragment key={project.id}>
              <tr onClick={() => toggleProjectDetails(project.id)} style={{ cursor: 'pointer' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                  {project.name} {expandedProjectId === project.id ? '▼' : '▶'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.allocatedHours}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{project.actualHours}</td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    color: project.actualHours > project.allocatedHours ? 'red' : 'green',
                  }}
                >
                  {calculateTimeStatus(project.allocatedHours, project.actualHours)}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    color: project.riskOfOvertime ? 'orange' : 'green',
                  }}
                >
                  {project.riskOfOvertime ? 'At Risk' : 'On Track'}
                </td>
              </tr>

              {/* Project Details and Task Report (conditionally rendered) */}
              {expandedProjectId === project.id && (
                <>
                  <tr>
                    <td colSpan="5" style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
                      <strong>Project Details:</strong>
                      <p>{project.description}</p>
                      <p>
                        <strong>Project Manager:</strong> {project.projectManager}
                      </p>
                      <p>
                        <strong>Start Date:</strong> {project.startDate} | <strong>End Date:</strong> {project.endDate}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="5">
                      <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Task Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Allocated Hours</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actual Hours</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.tasks?.length > 0 ? (
                            project.tasks.map((task) => (
                              <tr key={task.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.title}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.allocatedHours}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{task.actualHours}</td>
                                <td
                                  style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    color: task.actualHours > task.allocatedHours ? 'red' : 'green',
                                  }}
                                >
                                  {calculateTimeStatus(task.allocatedHours, task.actualHours)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                No tasks available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
