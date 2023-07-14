import React, { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import {Link} from "react-router-dom";
import MyCalendar from "./MyCalendar";
import { ProjectForm } from "./ProjectForm";

export function Projects({
  projectStates,
  user,
  setProjects,
  userProjects,
  projectTasks,
  userTasks,
  addNewProject
}) {
  const [seeProjectForm, showProjectForm] = useState(false)
  const [projectComponents, setProjectComponents] = useState([]); // <-- Declare new state for project components

  const seeForm =()=>{
    showProjectForm(!seeProjectForm)
  }

  useEffect(() => {
    const newProjectComponents = [];
  
    for (const projectId in projectStates) {
      const project = projectStates[projectId];
      const theseTasks = userTasks.filter(
        (tasks) => tasks.project_id === project.id
      );
      newProjectComponents.push(
        <ProjectCard
          key={project.id}
          project={project}
          user={user}
          tasks={theseTasks}
        />
      );
    }

    setProjectComponents(newProjectComponents); // <-- Update the project components state
  }, [projectStates|| user || userTasks]); // <-- Run this effect when projectStates, user, or userTasks changes

  return (
    user ? (
      <div>
        <div className="flex right-20 z-0" >
          <div className="px-16 mx-auto my-1 text-center rounded-full cursor-default select-none text-4xl font-sans bg-violet-500 py-4 text-white">Welcome, {user?.name}</div>
          <MyCalendar user={user} userTasks={userTasks} className='bg-black my-1 flex top-2 z-0'/>
        </div>
        <div><br/> </div>
        <button className=' mt-0 px-6 py-0 fixed left-3 text-right rounded-xl text-xl font-sans bg-yellow-500 text-white"'onClick={seeForm}>+</button>
        {seeProjectForm ? (
          <ProjectForm key={1} user={user} addNewProject={addNewProject} />
        ) : null}
        <div className="bg-scroll">{projectComponents}</div> {/* <-- Render the project components */}
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
