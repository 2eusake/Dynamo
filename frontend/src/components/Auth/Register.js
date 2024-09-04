import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consultant');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', { username, email, password, role });
      toast.success(`Registration successful! Welcome, ${username}`);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deloitte-white">
      <div className="bg-deloitte-blue p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-deloitte-white text-2xl mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 rounded border border-deloitte-cyan focus:outline-none focus:ring-2 focus:ring-deloitte-cyan"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 rounded border border-deloitte-cyan focus:outline-none focus:ring-2 focus:ring-deloitte-cyan"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 rounded border border-deloitte-cyan focus:outline-none focus:ring-2 focus:ring-deloitte-cyan"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded border border-deloitte-cyan focus:outline-none focus:ring-2 focus:ring-deloitte-cyan"
            required
          >
            <option value="consultant">Consultant</option>
            <option value="projectManager">Project Manager</option>
            <option value="director">Director</option>
          </select>
          <button
            type="submit"
            className="w-full bg-deloitte-green text-deloitte-black py-2 rounded hover:bg-deloitte-cyan"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-deloitte-white text-center">
          Have an account? <Link to="/login" className="text-deloitte-cyan hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
