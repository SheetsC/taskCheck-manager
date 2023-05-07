import React, { useState, useEffect} from 'react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useLocation } from 'react-router-dom';


export function Tasks({ userProjects, deleteTask, user, userTasks, checkCompleted, addNewTask, setProjectTasks, projectTasks }) {  
  const location = useLocation();
  const projectId = 
  location.state.projectId;
  // const user = JSON.parse(location.state.user);
  const project = userProjects.filter(project => project.id === projectId)
  const projectName=project.map(project=>{return project.name})
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
    return <TaskCard key={task.id} userProjects={userProjects}deleteTask={deleteTask} projectTasks={projectTasks} checkCompleted={checkCompleted} {...task} projectId={projectId} />;
  });
  
  return (
    <div>
      <h1> Tasks for {projectName}
        <button 
          onClick={seeTaskForm}
        >+</button>
        {showForm ? (<TaskForm key={1} projectId={projectId} addNewTask={addNewTask} user={user}/>) : null}
      </h1>
      <ul>{taskComponents}</ul>
    </div>
  );
}