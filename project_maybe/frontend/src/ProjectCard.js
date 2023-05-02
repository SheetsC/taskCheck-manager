import React from 'react';
import { Link } from 'react-router-dom';

export function ProjectCard({ id, name, end_date, booleanCompleted}) {
  const undoneTask = booleanCompleted.filter(value => value !== true);
  
  return (
    <Link to="/tasks/">
      <h3>
        Project: {name} Due: {end_date} {undoneTask.length > 0 ? 'Not complete' : 'Complete'}
      </h3>
    </Link>
  );
}
