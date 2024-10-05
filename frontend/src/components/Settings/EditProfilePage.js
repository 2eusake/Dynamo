

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, User, Mail } from 'lucide-react';
// import apiClient from '../../utils/apiClient'; // If you have an API client utility

// const InputField = ({ icon: Icon, type, placeholder, value, onChange, name, error }) => (
//   <div className="mb-4">
//     <div className="relative">
//       <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//       <input
//         type={type}
//         placeholder={placeholder}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className={`w-full pl-10 pr-3 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
//       />
//     </div>
//     {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//   </div>
// );

// const EditProfilePage = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: '' })); // Clear errors on input change
//     console.log(formData);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {};
    
//     // Validation
//     if (!formData.username) newErrors.username = 'Username is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
//     // If validation fails, show errors
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Simulate API call to update user profile
//       // Replace this with your actual API call (e.g., apiClient.post('/user/update', formData))
//       await apiClient.put('/user/profile', formData); // Assuming PUT request for profile update

//       // Navigate back to settings after successful update
//       navigate('/settings');
//     }catch (error) {
//       console.error('Failed to update profile:', error);
//       if (error.response) {
//         console.log('Error response:', error.response.data); // Logs the error from the server
//         setErrors({ form: error.response.data.message || 'Failed to update profile. Please try again.' });
//       } else {
//         setErrors({ form: 'Failed to update profile. Please try again.' });
//       }
//     }
    
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
//       <button onClick={() => navigate('/settings')} className="mb-4 flex items-center text-deloitte-dark-green hover:text-blue-600">
//         <ArrowLeft size={20} className="mr-1" /> Back to Settings
//       </button>
//       <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      
//       {/* Error message for the entire form */}
//       {errors.form && <p className="mb-4 text-sm text-red-500">{errors.form}</p>}
      
//       <form onSubmit={handleSubmit}>
//         <InputField
//           icon={User}
//           type="text"
//           placeholder="Username"
//           name="username"
//           value={formData.username}
//           onChange={handleChange}
//           error={errors.username}
//         />
//         <InputField
//           icon={Mail}
//           type="email"
//           placeholder="Email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           error={errors.email}
//         />
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-deloitte-dark-green text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
//         >
//           {isLoading ? 'Saving...' : 'Save Changes'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProfilePage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const InputField = ({ icon: Icon, type, placeholder, value, onChange, name, error }) => (
  <div className="mb-4">
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type={type}
        placeholder={placeholder}
        name={name}  // Ensure name is passed correctly
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
  const { user, updateUser } = useAuth(); // Get user and updateUser from the context
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear errors on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    // Validation logic
    if (!formData.username) validationErrors.username = 'Username is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = 'Email is invalid';

    // If validation fails, update the error state and exit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Call the updateUser function to update the profile via API
      await updateUser(formData);
      alert('Profile updated successfully!');
      navigate('/settings');
    } catch (err) {
      setErrors({ form: 'Failed to update profile. Please try again.' });
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <button onClick={() => navigate('/settings')} className="mb-4 flex items-center text-deloitte-dark-green hover:text-blue-600">
        <ArrowLeft size={20} className="mr-1" /> Back to Settings
      </button>
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

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
          className="w-full bg-deloitte-dark-green text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;


