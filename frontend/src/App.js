import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectDetail from './components/Project/ProjectDetail';
import ProjectList from './components/Project/ProjectList';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import CreateProject from './components/Project/CreateProject';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="bg-deloitte-white text-deloitte-black min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/create-project" element={<CreateProject />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
