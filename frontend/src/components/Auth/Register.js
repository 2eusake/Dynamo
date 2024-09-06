import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "./Register.css"; // Import the CSS file

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("consultant");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        username,
        email,
        password,
        role,
      });
      alert(`Registration successful! Welcome, ${username}`);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deloitte-white bg-register-bg">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://s3.amazonaws.com/company-photo.theladders.com/17064/fec5ed0f-31ae-46f8-b7e1-6b09b01c6714.png"
            alt="Deloitte Logo"
            className="h-12 mr-2"
          />
          <h1 className="text-3xl text-deloitte-black font-bold">
            Dynamo
          </h1>
        </div>
        <h2 className="text-black text-2xl mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 rounded border border-deloitte-dark-green focus:outline-none focus:ring-2 focus:ring-deloitte-dark-green"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 rounded border border-deloitte-dark-green focus:outline-none focus:ring-2 focus:ring-deloitte-dark-green"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 rounded border border-deloitte-dark-green focus:outline-none focus:ring-2 focus:ring-deloitte-dark-green"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded border border-deloitte-dark-green focus:outline-none focus:ring-2 focus:ring-deloitte-dark-green"
            required
          >
            <option value="consultant">Consultant</option>
            <option value="projectManager">Project Manager</option>
            <option value="director">Director</option>
          </select>
          <button
            type="submit"
            className="w-full bg-deloitte-dark-green text-white py-2 rounded hover:bg-deloitte-cyan"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-black">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-deloitte-dark-green hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
