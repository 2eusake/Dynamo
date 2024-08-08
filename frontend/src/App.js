// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectDetail from './components/Project/ProjectDetail';
import ProjectList from './components/Project/ProjectList';
import CreateProject from './components/Project/CreateProject';
import EditProject from './components/Project/EditProject';
import TaskDetail from './components/Task/TaskDetail';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './protectedRoute';
import Footer from './components/Common/Footer';
import Navbar from './components/Common/Navbar';
import ProjectProvider from './contexts/ProjectContext';
import TaskProvider from './contexts/TaskContext';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {user && <Navbar />}
      <div className="bg-deloitte-white text-deloitte-black min-h-screen">
        <ProjectProvider>
        <TaskProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/projects" element={<ProtectedRoute element={<ProjectList />} />} />
          <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetail />} />} />
          <Route path="/projects/edit/:id" element={<ProtectedRoute element={<EditProject />} />} />
          <Route path="/create-project" element={<ProtectedRoute element={<CreateProject />} />} />
          <Route path="/tasks/:id" element={<ProtectedRoute element={<TaskDetail />} />} />
        </Routes>
        </TaskProvider>
        </ProjectProvider>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
