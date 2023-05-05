import React, { useEffect, useState } from 'react';
import { array } from 'yup';
import { ProjectCard } from './ProjectCard';

export function Projects({ userProjects, projectTasks, userTasks }) {
  console.log(projectTasks)
  const projectIdsArray = Object.keys(projectTasks);
  const tasksArrays = Object.values(projectTasks);
  console.log(projectIdsArray)
  console.log(tasksArrays)
  const taskArray = tasksArrays.map(array => array)
  console.log(taskArray)
  const projectComponents = userProjects.map((project) => {
    const tasksForProject = tasksArrays.filter(task => task.project_id === project.id);
    return (
      <ProjectCard 
        key={project.id}
        {...project}
        tasks={tasksForProject}
        
      />
    );
  });

  return <div>{projectComponents}</div>;
}