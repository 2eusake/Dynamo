// src/components/Teams/TeamsPage.js

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../utils/apiClient'; 
import { Card, CardHeader, CardTitle, CardContent } from '../UIComp'; // Importing UIComp components
import { User, Filter } from 'lucide-react'; // Icons for UI enhancements

const TeamsPage = () => {
    // State variables for filters
    const [filteredRole, setFilteredRole] = useState('');
    
    // Retained state variables for potential future filters
    const [filteredGroup, setFilteredGroup] = useState('');
    const [filteredProject, setFilteredProject] = useState('');
    const [filteredTaskType, setFilteredTaskType] = useState('');

    // State variables for dropdown options
    const [roles] = useState(['Consultant', 'Project Manager', 'Director']); // Predefined roles
    const [groups, setGroups] = useState([]);
    const [projects, setProjects] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);

    // State for users
    const [users, setUsers] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Retained task counts state for potential future use
    const [taskCounts, setTaskCounts] = useState({});
    const [userTaskCounts, setUserTaskCounts] = useState({});

    // Fetch projects and tasks on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [projectsResponse, tasksResponse] = await Promise.all([
                    apiClient.get('/projects'), // Ensure this endpoint exists and returns projects
                    apiClient.get('/tasks')      // Ensure this endpoint exists and returns tasks
                ]);

                // Assuming /projects returns { projects: [...] }
                setProjects(projectsResponse.data.projects || []);
                // Assuming /tasks returns { tasks: [...] }
                const tasksData = tasksResponse.data.tasks || [];
                setTaskTypes([...new Set(tasksData.map(task => task.type))]); // Extract unique task types
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Failed to fetch initial data.');
                toast.error('Failed to fetch initial data.');
            }
        };

        fetchInitialData();
    }, []);

    // Fetch filtered users whenever the role filter changes
    useEffect(() => {
        const fetchFilteredUsers = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filteredRole) params.role = filteredRole;

                // Make sure the /users/filter endpoint exists and returns { users: [...] }
                const response = await apiClient.get('/users/filter', { params });

                // Debug: Log the response to verify structure
                console.log('Filtered Users Response:', response.data);

                // Check if response.data.users exists and is an array
                if (response.data && Array.isArray(response.data.users)) {
                    setUsers(response.data.users);

                    // Extract unique groups from the fetched users
                    const uniqueGroups = [...new Set(response.data.users.map(user => user.groupName))];
                    setGroups(uniqueGroups);

                    // Calculate task counts (number of tasks per type)
                    const counts = {};
                    response.data.users.forEach(user => {
                        if (user.tasks && Array.isArray(user.tasks)) {
                            user.tasks.forEach(task => {
                                counts[task.type] = (counts[task.type] || 0) + 1;
                            });
                        }
                    });
                    setTaskCounts(counts);

                    // Calculate user counts per task type
                    const userCounts = {};
                    response.data.users.forEach(user => {
                        if (user.tasks && Array.isArray(user.tasks)) {
                            const uniqueTaskTypes = new Set(user.tasks.map(task => task.type));
                            uniqueTaskTypes.forEach(type => {
                                userCounts[type] = (userCounts[type] || 0) + 1;
                            });
                        }
                    });
                    setUserTaskCounts(userCounts);
                } else {
                    // Handle unexpected response structure
                    console.warn('Unexpected response structure:', response.data);
                    setUsers([]);
                    setGroups([]);
                    setTaskCounts({});
                    setUserTaskCounts({});
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching filtered users:', err);
                setError('Failed to fetch users.');
                toast.error('Failed to fetch users.');
                setUsers([]);
                setGroups([]);
                setTaskCounts({});
                setUserTaskCounts({});
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredUsers();
    }, [filteredRole]);

    // Handler function for role change
    const handleRoleChange = (event) => {
        setFilteredRole(event.target.value);
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <Card className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6`}>
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <CardTitle className="text-2xl font-bold flex items-center mb-2 md:mb-0">
                        <User className="mr-2" size={24} />
                        Teams
                    </CardTitle>
                    <div className="flex flex-wrap space-x-4">
                        {/* Role Filter */}
                        <div className="flex items-center mb-2 md:mb-0">
                            <Filter className="text-gray-500 mr-2" />
                            <select
                                value={filteredRole}
                                onChange={handleRoleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="">All Roles</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <p className="text-gray-500 dark:text-gray-300">Loading team members...</p>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-4">{error}</div>
                    ) : (
                        <>
                            <div className="mb-4 text-right">
                                <strong>Total Employees: {users.length}</strong>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                Group
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((member, index) => (
                                                <tr
                                                    key={member.id}
                                                    className={`${
                                                        index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-600' : 'bg-white dark:bg-gray-700'
                                                    } hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors duration-200`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {member.username}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {member.email || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {member.role}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {member.groupName}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
                                                    No team members found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
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
