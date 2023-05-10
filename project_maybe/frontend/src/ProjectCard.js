import React,{useEffect, useState} from 'react';
import { useNavigate  } from 'react-router-dom';

export function ProjectCard({ project, user, tasks }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [otherUserTasks, setOtherUserTasks] =useState([])

    
  useEffect(() => {
    fetch(`/projects/${project.id}`)
    .then(r=>r.json())
    .then(projData=> {
      setUsers(projData[0].users)
      setOtherUserTasks(
        projData[0].tasks.filter(
          task=>task.user_id !== user.id && task.complete !== true
          ))
      
    })
  },[user])
  console.log(tasks);
  const myUndoneTasks= tasks.filter(task=> task.user_id === user.id && task.complete !== true)
  console.log(myUndoneTasks);
  const allTasksComplete = tasks.every(task => task.complete);
  console.log(allTasksComplete);
  function handleClick() {
    navigate('/tasks', { state: { projectId: project.id, user: user } });
  }
  const userComponents =  users.map(user =>{
    return (
      <div class='mt-03 cursor-pointer select-none' key={user.id}>
        <ul>{user.name} | 
        username:  {user.username} | 
        Logged in: {user.logged_in? "True" : "False"} |

        </ul>
      </div>
    )
  })

  return (
    <div className={`mt-28 max-w-2xl mx-auto px-6 py-8 lg:px-8 rounded-full block ${allTasksComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-emerald-600' }`} onClick={handleClick}>
    <h3 className="text-2xl text-center font-bold mb-4" key={project.id}>
      Project: {project.name}
    </h3>
    <div className="flex text-center mb-4">
      <div className="font-bold items-center text-center">
        Due Date:
      </div>
      <div class='px-5 text-center'>
        {project.end_date}
      </div>
    </div>
    <div className="flex text-center mb-4">
      <div className="font-bold">
        Users:
      </div>
      <div className='px-5'>
        {userComponents}
      </div>
    </div>
    <div className="flex flex-col gap-2 mb-4">
      <div className="font-bold">
        Project Status: {project.status}
      </div>
      <div className='items-center text-center mb-1'>
        {allTasksComplete ? "Complete" : "Not Done"}
        {myUndoneTasks.length > 0 ? " (You have tasks to do)" : ""}
        {otherUserTasks.length > 0 ? " (Other users have tasks to do)" : ""}
      </div>
    </div>
  </div>
)}
