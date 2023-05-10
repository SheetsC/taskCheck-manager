import React, { useState, useEffect} from 'react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';



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
    // sort by due date first
    if (taskA.due_date < taskB.due_date) {
      return -1;
    } else if (taskA.due_date > taskB.due_date) {
      return 1;
    }
  
    // sort completed tasks at the end of the list
    if (taskA.completed && !taskB.completed) {
      return 1;
    } else if (!taskA.completed && taskB.completed) {
      return -1;
    }
  
    // if both tasks have the same completion status and due date, keep their order
    return 0;
  }).map((task, index) => {
    const taskIndex = filteredTasks.map((task) => task.index);
    console.log(taskIndex)
    return <TaskCard key={task.id} user={user} index={index+1} userTasks={userTasks} userProjects={userProjects} deleteTask={deleteTask} projectTasks={projectTasks} checkCompleted={checkCompleted} {...task} projectId={projectId} />;
  });
  
  
  return(
    user ? 
    (<div className="font-sans sticky top-0 z-10 position-fixed">
      <div className="text-center font-sans rounded-full mt-10 text-4xl  bg-emerald-500 py-4 text-white">
        My Tasks for {projectName}
      </div>
      <div className="font-sans font-xl mt-10">
        <button className=' mt-0 px-6 py-0 text-right rounded-xl text-xl font-sans bg-yellow-500 text-white"'onClick={seeTaskForm}>+</button>
        {showForm ? (
          <TaskForm key={1} projectId={projectId} addNewTask={addNewTask} user={user} />
        ) : null}
        <ul className="grid grid-cols-4 scroll-smooth">{taskComponents}</ul>
      </div>
    </div>): (<div className="mt-28 rounded-sm max-w-2xl flex flex-col mx-auto gap-3">
      <div className="text-center text-xl font-sans text-red-500">
        To see Tasks you must Login
      </div>
      <Link to="/login">
        <button className="bg-black max-w-2xl py-3 px-6 font-sm rounded-full text-white hover:bg-gray-800">
          Login
        </button>
      </Link>
    </div>)
  );
}