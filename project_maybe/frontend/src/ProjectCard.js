import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ProjectCard({ project, user, tasks  }) {
  const navigate = useNavigate();
  
  console.log(tasks);
  
  const allTasksComplete = tasks.every(task => task.complete);
  console.log(allTasksComplete);
  function handleClick() {
    navigate('/tasks', { state: { projectId: project.id, user: user } });
  }

  return (
    <div onClick={handleClick}>
      <h3>
        Project: {project.name} Due: {project.end_date} 
        {allTasksComplete ? " - Complete" : "Not Done"}
      </h3>
    </div>
  );
}
