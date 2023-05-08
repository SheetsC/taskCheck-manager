import React,{useEffect, useState} from 'react';
import { useNavigate  } from 'react-router-dom';

export function ProjectCard({ project, user, tasks  }) {
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
      <div class='mt-03' key={user.id}>
        <ul>{user.name} | 
        username:  {user.username} | 
        Logged in: {user.logged_in? "True" : "False"} |

        </ul>
      </div>
    )
  })

  return (
    <div class='mt-28 text-base mx-auto rounded-full bg-emerald-400 block max-w-2xl text-center justify-center gap-x-6 p-6 lg:px-8' onClick={handleClick}>
      <h3 key = {project.id}>
        Project: {project.name} Due: {project.end_date} Users: {userComponents}
        {allTasksComplete ? " - Complete" : "Not Done"}: {myUndoneTasks.length > 0 ? " I have tasks to do ": " " }
        {otherUserTasks.length > 0 ? '| Other users have tasks to do' : ''}
        
      </h3>
    </div>
  );
}
