import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to process that login. Please try again.");
      }
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <img
            src="https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png"
            alt="Deloitte Logo"
            className="deloitte-logo"
          />
        </div>

        <h2 className="login-title">Login</h2>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="eid" className="input-label">
              Email ID
            </label>
            <input
              name="eid"
              id="eid"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="pw" className="input-label">
              Password
            </label>
            <input
              name="pw"
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="input-field"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="link-group">
            <Link to="/forgot-password" className="link">
              Forgot password?
            </Link>
            <Link to="/register" className="link">
              Create new account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;