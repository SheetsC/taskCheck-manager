import React, {useState, useEffect} from 'react'
import {TaskCard} from './TaskCard'
export function Tasks({projectTasks}) {
    // const project = [...userProjects].map((project)=>project)
    // const [projectTasks, setProjectTasks] = useState([]);

    // useEffect(()=>{
    //   fetch(`projects/${project?.id}/tasks`)
    //   .then(r=>r.json())
    //   .then(datasetProjectTasks)
    // },[project?.id])

    const taskComponents = 
        projectTasks.map((task)=>{
    return(
        <TaskCard {...task}/>
    )})
  return (
    <div>
        {taskComponents}
    </div>
  )
}
