
import React, { useEffect } from "react";
import { ProjectCard } from "./ProjectCard";
import {Link} from "react-router-dom";

export function Projects({
  projectStates,
  user,
  setProjects,
  userProjects,
  projectTasks,
  userTasks,
}) {
  const projectComponents = [];
  
  for (const projectId in projectStates) {
    const project = projectStates[projectId];
    const theseTasks = userTasks.filter(
      (tasks) => tasks.project_id === project.id
    );
    projectComponents.push(
      <ProjectCard
        key={project.id}
        project={project}
        user={user}
        tasks={theseTasks}
      />
    );
  }

  

  return (
    user ? (
      <div>
        <div className="text-center rounded-full cursor-default select-none text-4xl font-sans bg-violet-500 py-4 text-white">
          Welcome, {user?.name}
        </div>
        <div className="scroll-smooth">{projectComponents}</div>
      </div>
    ) : (
      <div className="mt-28 rounded-sm max-w-2xl flex flex-col mx-auto gap-3">
        <div className="text-center text-xl font-sans cursor-default select-none text-red-500">
          To see Projects you must Login
        </div>
        <Link to="/login">
          <button className="bg-black max-w-2xl font-sans py-3 px-6 font-sm rounded-full text-white hover:bg-gray-800">
            Login
          </button>
        </Link>
      </div>
    )
  );
}