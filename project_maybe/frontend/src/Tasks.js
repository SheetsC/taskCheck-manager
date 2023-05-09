import React, { useState, useEffect} from 'react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useLocation } from 'react-router-dom';
import { WhenAuth } from './WhenAuth';


export function Tasks({ userProjects, deleteTask, user, userTasks, checkCompleted, addNewTask, setProjectTasks, projectTasks }) {  
  const location = useLocation();
  let projectId = parseInt("0")
  if (location && location.state){
    projectId = location.state.projectId
  }
  
  // const user = JSON.parse(location.state.user);
  console.log(projectId);
  const project = userProjects.filter(project => project.id === projectId )
  const projectName=project.map(project=>{return project.name})
  const filteredTasks = userTasks.filter(task => task.project_id === projectId && task.user_id === user.id) ;
  // rest of the component code
  // console.log(filteredTasks)
  useEffect(() =>{
    setProjectTasks(filteredTasks)
  
  },[userTasks])
  const [showForm, setShowForm] = useState(false);
  const seeTaskForm = () => {
    setShowForm(!showForm);
  };
  
  const taskComponents = filteredTasks.sort((taskA, taskB) => {
    // sort completed tasks at the end of the list
    if (taskA.completed && !taskB.completed) {
      return 1;
    } else if (!taskA.completed && taskB.completed) {
      return -1;
    }
    // if both tasks have the same completion status, sort by due date
    
    return taskA.due_date.localeCompare(taskB.due_date);
  }).map((task) => {
    return <TaskCard key={task.id} user={user} userTasks={userTasks} userProjects={userProjects}deleteTask={deleteTask} projectTasks={projectTasks} checkCompleted={checkCompleted} {...task} projectId={projectId} />;
  });
  
  return (
    <WhenAuth>
      <div class="mt-28 font-sans font-xl ">
        <h1 className='text-center'> My Tasks for {projectName}
          <button 
            onClick={seeTaskForm}
          >+</button>
          {showForm ? (<TaskForm key={1} projectId={projectId} addNewTask={addNewTask} user={user}/>) : null}
        </h1>
        <ul>{taskComponents}</ul>
      </div>
    </WhenAuth>
  );
}