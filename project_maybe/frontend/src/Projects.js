
import React, { useEffect } from "react";
import { ProjectCard } from "./ProjectCard";
import {Link} from "react-router-dom";
import MyCalendar from "./MyCalendar";

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
        <div className="fixed right-20 z-0" >
          <div className="px-16 mx-auto my-1 text-center rounded-full cursor-default select-none text-4xl font-sans bg-violet-500 py-4 text-white">Welcome, {user?.name}</div>
          <MyCalendar user={user} userTasks={userTasks} className='bg-slate-800 my-1 flex top-2 z-0'/>
        </div>
        <div><br/></div>
        <div className="bg-scroll cursor-pointer">{projectComponents}</div>
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