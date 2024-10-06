import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../utils/apiClient'; 
import { Card, CardHeader, CardTitle, CardContent } from '../UIComp'; // Importing UIComp components
import { User, Filter } from 'lucide-react'; 

const TeamsPage = () => {
    // State variable for role filter
    const [filteredRole, setFilteredRole] = useState('');
    
    // State for users
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users when role filter changes
    useEffect(() => {
        const fetchFilteredUsers = async () => {
            setLoading(true);
            try {
                const params = {};
                if (filteredRole) params.role = filteredRole;

                const response = await apiClient.get('/users/filter', { params });

                if (response.data && response.data.users) {
                    setUsers(response.data.users);
                    setError(null);
                } else {
                    setUsers([]);
                    setError('No users found.');
                }
            } catch (err) {
                console.error('Error fetching filtered users:', err);
                setError('Failed to fetch users.');
                toast.error('Failed to fetch users.');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredUsers();
    }, [filteredRole]);

    // Handle role change
    const handleRoleChange = (event) => {
        setFilteredRole(event.target.value);
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <CardTitle className="text-2xl font-bold flex items-center mb-2 md:mb-0">
                        <User className="mr-2" size={24} />
                        Members
                    </CardTitle>
                    <div className="flex space-x-4">
                        {/* Role Filter */}
                        <div className="flex items-center">
                            <Filter className="text-gray-500 mr-2" />
                            <select
                                value={filteredRole}
                                onChange={handleRoleChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="">All Roles</option>
                                <option value="Consultant">Consultant</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Director">Director</option>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((member, index) => (
                                                <tr
                                                    key={member.id}
                                                    className={
                                                        index % 2 === 0
                                                            ? 'bg-gray-50 dark:bg-gray-600'
                                                            : 'bg-white dark:bg-gray-700'
                                                    }
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
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-center">
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
        </div>
    );
};

export default TeamsPage;
