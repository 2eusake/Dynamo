import React, {useState} from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ProjectList from './ProjectList';


const Projects = () => {
    const [isClicked, setIsClicked] = useState (false);

    const handleGridItemClick = () => {
        setIsClicked(true);
    };

  return (
    <div>
      <h2>Projects</h2>

      <ProjectList handleGridItemClick={handleGridItemClick} />
      <Routes>
        <Route path="/project/:projectId" component={ProjectDetail} />
      </Routes>
    </div>
  );
 
};
export default Projects;