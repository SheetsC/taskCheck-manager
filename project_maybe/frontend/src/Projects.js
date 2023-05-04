import React, { useEffect, useState } from 'react';
import { ProjectCard } from './ProjectCard';

export function Projects({ booleanCompleted, userProjects, projectTasks, userTasks }) {
  console.log(booleanCompleted)
  const tasksArray = Object.values(projectTasks);
  
  const projectComponents = userProjects.map((project) => {
    const tasksForProject = tasksArray.filter(task => task.project_id === project.id);
    return (
      <ProjectCard 
        key={project.id}
        {...project}
        tasks={tasksForProject}
        booleanCompleted={booleanCompleted}
      />
    );
  });

  return <div>{projectComponents}</div>;
}