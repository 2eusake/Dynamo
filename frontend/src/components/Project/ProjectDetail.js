import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProjectContext } from "../../contexts/ProjectContext";
import "./ProjectDetail.css";

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, loading, error } = useContext(ProjectContext);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (loading) {
      console.log("Loading projects...");
      return;
    }

    if (error) {
      console.log("Error loading projects:", error);
      return;
    }

    if (projects.length > 0 && id) {
      const projectId = parseInt(id, 10);
      const selectedProject = projects.find((p) => p.id === projectId);
      console.log("Selected Project:", selectedProject);
      setProject(selectedProject || null);
    } else {
      console.log("No projects available or ID missing.");
    }
  }, [id, projects, loading, error]);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>Error loading projects: {error}</p>;
  }

  if (!project) {
    return <p>No project found.</p>;
  }

  return (
    <div className="project-detail-container">
      <h2>Project Detail - {project.name}</h2>
      <p>
        <strong>Description:</strong>{" "}
        {project.description || "No description available"}
      </p>
      <p>
        <strong>Progress:</strong> {project.progress || 0}%
      </p>
      <h3>Tasks</h3>
      {project.tasks && project.tasks.length > 0 ? (
        <ul>
          {project.tasks.map((task) => (
            <li key={task.id}>
              <Link to={`/tasks/${task.id}`} className="task-link">
                {task.name} - {task.progress}% complete
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available for this project.</p>
      )}
      <Link to="/projects" className="back-to-projects">
        Back to Projects
      </Link>
    </div>
  );
};

export default ProjectDetail;
