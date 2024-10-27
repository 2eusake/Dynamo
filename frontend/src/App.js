
import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/RoleBasedDashboard";
import ProjectDetail from "./components/Project/ProjectDetail";
import ProjectList from "./components/Project/ProjectList";
import CreateProject from "./components/Project/CreateProject";
import EditProject from "./components/Project/EditProject";
import TaskDetail from "./components/Task/TaskDetail";
import TasksPage from "./components/Task/TasksPage";
import ProtectedRoute from "./protectedRoute";
import ProjectProvider from "./contexts/ProjectContext";
import ReportsPage from "./components/Reports/ReportsPage";
import TaskProvider from "./contexts/TaskContext";
import "react-toastify/dist/ReactToastify.css";
import "./tailwind.css";
import Settings from "./components/Settings/SettingsPage";
import EditProfilePage from "./components/Settings/EditProfilePage";
import ResetPasswordPage from "./components/Settings/ResetPasswordPage";
import { UserProvider } from "./contexts/UserContext"; 
import Spinner from "./components/Common/Spinner";
import "./App.css";
import Layout from "./components/Layout";
import Timesheet from "./components/Timesheet/Timesheet";
import TeamsPage from "./components/Teams/TeamsPage"; // Import the TeamsPage component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AuthContext.Consumer>
          {({ user, loading }) => {
            if (loading) {
              return <Spinner />;
            }

            return (
              <>
                <ProjectProvider>
                  <TaskProvider>
                    <UserProvider>
                      <Routes>
                        {/* Routes that don't need Layout */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Routes that need Layout */}
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <Dashboard />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/projects"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <ProjectList />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/projects/:id"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <ProjectDetail />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/projects/edit/:id"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <EditProject />
                                </Layout>
                              }
                              allowedRoles={["Director", "Project Manager"]}
                            />
                          }
                        />
                        <Route
                          path="/create-project"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <CreateProject />
                                </Layout>
                              }
                              allowedRoles={["Director", "Project Manager"]}
                            />
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <Settings />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/settings/edit-profile"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <EditProfilePage />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/settings/reset-password"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <ResetPasswordPage />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/tasks"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <TasksPage />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/tasks/:taskId"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <TaskDetail />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        <Route
                          path="/reports"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <ReportsPage />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        
                        <Route
                          path="/timesheet"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <Timesheet />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                        
                        <Route
                          path="/teams"
                          element={
                            <ProtectedRoute
                              element={
                                <Layout>
                                  <TeamsPage />
                                </Layout>
                              }
                              allowedRoles={[
                                "Director",
                                "Project Manager",
                                "Consultant",
                              ]}
                            />
                          }
                        />
                      </Routes>
                    </UserProvider>
                  </TaskProvider>
                </ProjectProvider>
              </>
            );
          }}
        </AuthContext.Consumer>

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
    </AuthProvider>
  );
};

export default App;
