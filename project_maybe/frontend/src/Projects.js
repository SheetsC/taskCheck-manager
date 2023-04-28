import React, { useEffect, useState } from 'react';
import { ProjectCard } from './ProjectCard';

export function Projects({ userProjects }) {
  const [uniqueProjects, setUniqueProjects] = useState([]);

  useEffect(() => {
    const unique = userProjects.reduce((acc, project) => {
      if (!acc.some((p) => p.id === project.id)) {
        acc.push(project);
      }
      return acc;
    }, []);
    setUniqueProjects(unique);
  }, [userProjects]);

  const projectComponents = uniqueProjects.map((project) => (
    <ProjectCard key={project.id} {...project} />
  ));

  return <div>{projectComponents}</div>;
}

