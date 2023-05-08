import React,{useEffect, useState} from 'react';
import { useNavigate  } from 'react-router-dom';

export function ProjectCard({ project, user, tasks  }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`/projects/${project.id}`)
    .then(r=>r.json())
    .then(projData=> {
      setUsers(projData[0].users)
      
    })
  },[user?.id])
  console.log(tasks);
  
  const allTasksComplete = tasks.every(task => task.complete);
  console.log(allTasksComplete);
  function handleClick() {
    navigate('/tasks', { state: { projectId: project.id, user: user } });
  }
  const userComponents =  users.map(user =>{
    return (
      <div>
        <ul>{user.name} | username:  {user.username} | Logged in: {user.logged_in? "True" : "False"}</ul>
      </div>
    )
  })

  return (
    <div onClick={handleClick}>
      <h3>
        Project: {project.name} Due: {project.end_date} Users: {userComponents}
        {allTasksComplete ? " - Complete" : "Not Done"}
      </h3>
    </div>
  );
}
