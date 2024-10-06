// src/components/EditProfilePage.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Import AuthContext
import { Button } from '../UIComp'; // Import your Button component

const InputField = ({ icon: Icon, type, placeholder, value, onChange, name, error }) => (
  <div className="mb-4">
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-300'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth(); // Get user and updateUser from the context
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear errors on input change
    setSuccessMessage(''); // Clear success message on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Validation logic
    if (!formData.username.trim()) validationErrors.username = 'Username is required';
    if (!formData.email.trim()) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = 'Email is invalid';

    // If validation fails, update the error state and exit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Call the updateUser function to update the profile via API
      await updateUser(formData);
      setSuccessMessage('Profile updated successfully!');
      navigate('/settings'); // Optionally navigate back to settings
    } catch (err) {
      setErrors({ form: err.message || 'Failed to update profile. Please try again.' });
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <button
        onClick={() => navigate('/settings')}
        className="mb-4 flex items-center text-deloitte-dark-green hover:text-blue-600"
      >
        <ArrowLeft size={20} className="mr-1" /> Back to Settings
      </button>
      <h1 className="text-2xl font-bold mb-6 underline-green">Edit Profile</h1>

      {/* Success message */}
      {successMessage && <p className="mb-4 text-sm text-green-500">{successMessage}</p>}

      {/* Error message for the entire form */}
      {errors.form && <p className="mb-4 text-sm text-red-500">{errors.form}</p>}

      <form onSubmit={handleSubmit}>
        <InputField
          icon={User}
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />
        <InputField
          icon={Mail}
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-deloitte-dark-green text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
