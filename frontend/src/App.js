import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <Navigation />
      <div className="bg-deloitte-white text-deloitte-black min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => (
  <div className="text-center p-8">
    <h1 className="text-4xl font-bold text-deloitte-blue">Welcome to the Project Management Tool</h1>
  </div>
);

export default App;
