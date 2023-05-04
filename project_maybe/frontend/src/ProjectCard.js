import React from 'react';
import { useNavigate } from 'react-router-dom';

export function ProjectCard({ id, name, end_date, tasks, booleanCompleted, user }) {
  const navigate = useNavigate();
  
  
  function handleClick() {
    navigate('/tasks', { state: { projectId: id, user: user } });
  }

  return (
    <div onClick={handleClick}>
      <h3>
        Project: {name} Due: {end_date} 
        {booleanCompleted.length > 0 ? 'Not complete' : 'Complete'}
      </h3>
    </div>
  );
}
