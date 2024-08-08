import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // Adjust import path

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
    <div className="login-container">
      <form id="Mrphs-xlogin" onSubmit={handleSubmit} className="with-errors">
        <h1>Login Required</h1>
        {error && <div className="alertMessage" role="alert">{error}</div>}
        <fieldset>
          <label htmlFor="eid">Email</label>
          <input
            name="eid"
            id="eid"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            size="15"
            required
          />
          <label htmlFor="pw">Password</label>
          <input
            name="pw"
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            size="15"
            required
          />
          <p className="buttons">
            <input type="submit" id="submit" value="Log in" />
          </p>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
