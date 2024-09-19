
/*import React, { useState} from 'react';
import { BrowserRouter as useNavigate } from 'react-router-dom';


const resetPassword = () => new Promise(resolve => setTimeout(() => resolve(), 1000));

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      await resetPassword();
      setIsLoading(false);
      navigate.push('/settings');
    };
  
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          {// Add form fields here //}
          <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    );
  };*/

  /*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate

const resetPassword = () => new Promise(resolve => setTimeout(() => resolve(), 1000));

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await resetPassword();
        setIsLoading(false);
        navigate('/settings'); // Correct navigation
    };
  
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            <form onSubmit={handleSubmit}>
                {// Add form fields here //}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage; // Ensure you export the component */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Key, Eye, EyeOff } from 'lucide-react';

const InputField = ({ icon: Icon, type, placeholder, value, onChange, error }) => (
  <div className="mb-4">
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
const ResetPasswordPage = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/settings');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <button onClick={() => navigate('/settings')} className="mb-4 flex items-center text-deloitte-dark-green hover:text-blue-600">
        <ArrowLeft size={20} className="mr-1" /> Back to Settings
      </button>
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
          <div key={field} className="mb-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword[field] ? 'text' : 'password'}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword[field] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-deloitte-dark-green text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
