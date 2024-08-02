import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import

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
      alert(`Registration successful! Welcome, ${username}`);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="consultant">Consultant</option>
          <option value="projectManager">Project Manager</option>
          <option value="director">Director</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p>
        Have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
