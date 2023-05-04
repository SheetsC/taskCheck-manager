import React, { useState, useEffect} from 'react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useLocation } from 'react-router-dom';


export function Tasks({ deleteTask, user, userTasks, changeCompleteOnTaskId, addNewTask, setProjectTasks, projectTasks }) {  
  const location = useLocation();
  const projectId = 
  location.state.projectId;
  // const user = JSON.parse(location.state.user);

  const filteredTasks = userTasks.filter(task => task.project_id === projectId);
  // rest of the component code
  // console.log(filteredTasks)
  useEffect(() =>{
    setProjectTasks(filteredTasks)
  
  },[userTasks])
  const [showForm, setShowForm] = useState(false);
  const seeTaskForm = () => {
    setShowForm(!showForm);
  };
  const taskComponents = filteredTasks.map((task) => {
    return(
    <TaskCard key={task.id} deleteTask={deleteTask} projectTasks={projectTasks}changeCompleteOnTaskId={changeCompleteOnTaskId}{...task}/>
  )
  });
  
  return (
    <div>
      <h1>
        <button 
          onClick={seeTaskForm}
        >+</button>
        {showForm ? (<TaskForm key={1} projectId={projectId} addNewTask={addNewTask} user={user}/>) : null}
      </h1>
      <ul>{taskComponents}</ul>
    </div>
  );
}