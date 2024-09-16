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
import TasksPage from './components/Task/TasksPage';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './protectedRoute';
import Footer from './components/Common/Footer';
import Navbar from './components/Common/Navbar';
import Sidebar from './components/Dashboard/Sidebar';
import ProjectProvider from './contexts/ProjectContext';
import ReportsPage from './components/Reports/ReportsPage';
import TaskProvider from './contexts/TaskContext';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './tailwind.css';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {user && <Navbar />}
      <div className="bg-deloitte-white text-deloitte-black min-h-screen flex">
        {user && <Sidebar />}
        <div className={`flex-1 ${user ? 'ml-48' : ''} p-4`}>
          <ProjectProvider>
            <TaskProvider>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={<ProtectedRoute element={<Dashboard />} allowedRoles={['Director', 'Project Manager', 'Consultant']} />}
                />
                <Route
                  path="/projects"
                  element={<ProtectedRoute element={<ProjectList />} allowedRoles={['Director', 'Project Manager', 'Consultant']} />}
                />
                <Route
                  path="/projects/:id"
                  element={<ProtectedRoute element={<ProjectDetail />} allowedRoles={['Director', 'Project Manager', 'Consultant']} />}
                />
                <Route
                  path="/projects/edit/:id"
                  element={<ProtectedRoute element={<EditProject />} allowedRoles={['Director', 'Project Manager']} />}
                />
                <Route
                  path="/create-project"
                  element={<ProtectedRoute element={<CreateProject />} allowedRoles={['Director', 'Project Manager']} />}
                />
                <Route
                  path="/tasks"
                  element={<ProtectedRoute element={<TasksPage />} allowedRoles={['director', 'projectManager', 'Consultant']} />}
                />
                <Route
                  path="/tasks/:id"
                  element={<ProtectedRoute element={<TaskDetail />} allowedRoles={['Director', 'Project Manager', 'Consultant']} />}
                />
                <Route
                path="/reports"
                element={<ProtectedRoute element={<ReportsPage />} allowedRoles={['Director', 'Project Manager', 'Consultant']} />}
                />

              </Routes>
            </TaskProvider>
          </ProjectProvider>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

export default App;
