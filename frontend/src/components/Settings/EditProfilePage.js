
/*import React, { useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const editProfile = () => new Promise(resolve => setTimeout(() => resolve(), 1000));

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      await editProfile();
      setIsLoading(false);
      navigate.push('/settings');
    };
  
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          {// Add form fields here //}
          <button type="submit" disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    );
  };*/

  /*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const editProfile = () => new Promise(resolve => setTimeout(() => resolve(), 1000));

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await editProfile();
        setIsLoading(false);
        navigate('/settings'); // Use navigate directly
    };
  
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                {//Add form fields here //}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage; // Ensure you export the component */

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

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
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
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          icon={User}
          type="text"
          placeholder="Username"
          name="username "
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
          className="w-full bg-deloitte-dark-green text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};




export default EditProfilePage;
