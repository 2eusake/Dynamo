import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Unable to process that login, please try again.');
      console.error('Login failed', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deloitte-white">
      <div className="bg-deloitte-blue p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-deloitte-white text-2xl mb-6 text-center">Login Required</h1>
        {error && (
          <div className="alertMessage bg-red-500 text-deloitte-white p-2 rounded mb-4 text-center" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="eid" className="text-deloitte-white block mb-2">Email</label>
            <input
              name="eid"
              id="eid"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full p-2 rounded border border-deloitte-cyan focus:outline-none focus:ring-2 focus:ring-deloitte-cyan"
              required
            />
          </div>
          <div>
            <label htmlFor="pw" className="text-deloitte-white block mb-2">Password</label>
            <input
              name="pw"
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full p-2 rounded border border-deloitte-cyan focus:outline-none focus:ring-2 focus:ring-deloitte-cyan"
              required
            />
          </div>
          <p className="buttons">
            <input
              type="submit"
              id="submit"
              value="Log in"
              className="w-full bg-deloitte-green text-deloitte-black py-2 rounded hover:bg-deloitte-cyan"
            />
          </p>
          <p className="mt-4 text-deloitte-white text-center">
            Don't have an account? <Link to="/register" className="text-deloitte-cyan hover:underline">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
