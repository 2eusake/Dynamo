import React, { useState, useEffect } from 'react';
import './TeamsPage.css';
// Dummy data for team members (replace this with real data from your API)
const teamMembers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Project Manager' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Consultant' },
    { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', role: 'Director' },
    { id: 4, name: 'Emily White', email: 'emily.white@example.com', role: 'Consultant' },
    { id: 5, name: 'Robert Black', email: 'robert.black@example.com', role: 'Project Manager' },
];

const TeamsPage = () => {
    const [filteredRole, setFilteredRole] = useState('');
    const [employees, setEmployees] = useState(teamMembers);

    // Filter team members based on the selected role
    const handleFilterChange = (event) => {
        const role = event.target.value;
        setFilteredRole(role);

        if (role === '') {
            setEmployees(teamMembers); // Show all employees if no filter is selected
        } else {
            setEmployees(teamMembers.filter(member => member.role === role));
        }
    };

    return (
        <div className="teams-page">
            <h1 className="text-3xl font-bold mb-6 underline-green">Teams</h1>
            <div className="controls">
                <label htmlFor="role-filter">Filter by Role: </label>
                <select id="role-filter" value={filteredRole} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Director">Director</option>
                </select>
            </div>

            <div className="employee-count">
                <strong>Total Employees: {employees.length}</strong>
            </div>

            <table className="team-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamsPage;
