import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import PMDashboard from "./PMDashboard";
import ConsultantDashboard from "./ConsultantDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (user.role === "Consultant") {
    return <ConsultantDashboard />;
  } else {
    return <PMDashboard />;
  }
};

export default Dashboard;
