const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const reportRoutes = require("./routes/reportRoutes");
const importRoute = require("./routes/importRoute");
// const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", uploadRoutes); // Upload routes
app.use("/api/reports", reportRoutes);
// app.use("/api/notification", notificationRoutes);
app.use("/api/excel", importRoute);

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
