// src/components/ResetPasswordPage.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext
import { Button } from '../UIComp'; // Import your Button component

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { updatePassword } = useContext(AuthContext); // Get updatePassword from AuthContext
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear errors on input change
    setSuccessMessage(''); // Clear success message on input change
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Validation logic
    if (!formData.currentPassword) validationErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) validationErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) validationErrors.newPassword = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) validationErrors.confirmPassword = 'Please confirm your new password';
    else if (formData.newPassword !== formData.confirmPassword) validationErrors.confirmPassword = 'Passwords do not match';

    // If validation fails, update the error state and exit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Call the updatePassword function to update the password via API
      await updatePassword(formData);
      setSuccessMessage('Password updated successfully!');
      navigate('/settings'); // Optionally navigate back to settings
    } catch (err) {
      setErrors({ form: err.message || 'Failed to reset password. Please try again.' });
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 ${/* Ensure dark mode styles */ 'bg-white dark:bg-gray-800'} rounded-lg shadow-lg`}>
      <button
        onClick={() => navigate('/settings')}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-600"
      >
        <ArrowLeft size={20} className="mr-1" /> Back to Settings
      </button>
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

      {/* Success message */}
      {successMessage && <p className="mb-4 text-sm text-green-500">{successMessage}</p>}

      {/* Error message for the entire form */}
      {errors.form && <p className="mb-4 text-sm text-red-500">{errors.form}</p>}

      <form onSubmit={handleSubmit}>
        {/* Current Password */}
        <div className="mb-4 relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword.currentPassword ? 'text' : 'password'}
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
              errors.currentPassword ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('currentPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword.currentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.currentPassword && <p className="mb-4 text-sm text-red-500">{errors.currentPassword}</p>}

        {/* New Password */}
        <div className="mb-4 relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword.newPassword ? 'text' : 'password'}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
              errors.newPassword ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('newPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.newPassword && <p className="mb-4 text-sm text-red-500">{errors.newPassword}</p>}

        {/* Confirm New Password */}
        <div className="mb-4 relative">
          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword.confirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmPassword')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mb-4 text-sm text-red-500">{errors.confirmPassword}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
