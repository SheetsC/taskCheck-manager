// import React, { useEffect, useState } from 'react';
// import { ProjectCard } from './ProjectCard';
// //setting state for every project before it is sent to the project card
// export function Projects({ projectStates, user, setProjects, userProjects, projectTasks, userTasks }) {
  
//   console.log(projectStates)

//   const projectComponents = projectStates.map(project => (
//     <ProjectCard 
//       key={project.id}
//       project={project}
    

//       user={user}
//     />
//   ));

//   return <div>{projectComponents}</div>;
// }
import React from 'react';
import { ProjectCard } from './ProjectCard';
export function Projects({ projectStates, user, setProjects, userProjects, projectTasks, userTasks }) {
  
  

  
  
  const projectComponents = [];

  for (const projectId in projectStates) {
    const project = projectStates[projectId];
    const theseTasks= userTasks.filter(tasks => tasks.project_id === project.id)
    projectComponents.push(
      <ProjectCard 
        key={project.id}
        project={project}
        user={user}
        tasks={theseTasks}
      />
    );
  }

  return <div>{projectComponents}</div>;
}