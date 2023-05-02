import React, { useEffect, useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';

export function Projects({ userProjects, projectTasks }) {
  const [uniqueProjects, setUniqueProjects] = useState([]);
  const [booleanCompleted, setBooleanCompleted] = useState([]);
  const tasks = projectTasks.map(task => task.tasks);

  const flatTasks = useMemo(() => {
    return tasks.flatMap((nestedArray) => nestedArray);
  }, [tasks]);

  const completionList = useMemo(() => {
    return flatTasks.map(task => task.complete);
  }, [flatTasks]);

  useEffect(() => {
    const seeIfAllDone = () => { 
      setBooleanCompleted(completionList);
    };
    seeIfAllDone();

    const unique = userProjects.reduce((acc, project) => {
      if (!acc.some((p) => p.id === project.id)) {
        acc.push(project);
      }
      return acc;
    }, []);
    setUniqueProjects(unique);
  }, [userProjects]);

  const projectComponents = uniqueProjects.map((project) => {
    return(
    <ProjectCard key={project.id} {...project} booleanCompleted ={booleanCompleted}/>
  )
});
console.log(booleanCompleted)
  return <div>
    
    {projectComponents}
  </div>;
}

