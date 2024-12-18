const express = require("express");
const path = require("path");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const reportRoutes = require("./routes/reportRoutes");
const importRoute = require("./routes/importRoute");
const notificationRoutes = require("./routes/notificationRoutes");
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

app.use(express.static(path.join(__dirname, "../frontend/build")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", uploadRoutes);
app.use("/api/reports", reportRoutes); // Reports routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/excel", importRoute);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});


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
