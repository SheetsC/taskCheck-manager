import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Routes, Route } from 'react-router-dom';
import { Login } from './Login';
import { SignUp } from './Signup';
import { Projects } from './Projects';
import { Tasks } from './Tasks';

export function App() {
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  useEffect(() => {
    fetch('/check_session').then((response) => {
      if (response.ok) {
        response.json().then((user) => {
          sessionStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        });
      } else {
        const userFromLocalStorage = localStorage.getItem('user');
        if (userFromLocalStorage) {
          setUser(JSON.parse(userFromLocalStorage));
        }
      }
    });
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetch(`/users/${user.id}`)
        .then(response => response.json())
        .then(userData => {
          // Set user's projects
          setUserProjects(userData.projects);
  
          // Set user's tasks
          const tasks = userData.projects.flatMap(project => project.tasks);
          setUserTasks(tasks);
  
          // Set project tasks
          const projectTasks = {};
          userData.projects.forEach(project => {
            const projectId = project.id;
            const projectTasks = project.tasks.map(task => ({ ...task, projectId }));
            projectTasks[projectId] = projectTasks;
          });
          setProjectTasks(projectTasks);
        })
        .catch(error => console.error(error));
    } else {
      setUserProjects([]);
      setUserTasks([]);
      setProjectTasks({});
    }
  }, [user]);

  function handleLogin(user) {
    setUser(user);
  }

  function handleLogout() {
    fetch('/logout', {
      method: 'DELETE',
    }).then(() => setUser(null));
  }
  
  function checkCompleted(likedObj){
      const taskLiked = projectTasks.map(taskObj => {
        if(taskObj.id === likedObj.id){
          return likedObj
        }else{
          return taskObj
        }
      })
      setProjectTasks(taskLiked)
    }
  
    const [booleanCompleted, setBooleanCompleted] = useState([]);

    
    

     const seeIfAllDone = () => { 
      const allTasks = Object.values(projectTasks).flat();
      const completionList = allTasks.map(task => task.complete);
      setBooleanCompleted(completionList);
      console.log(completionList)
    };

    useEffect(() => {seeIfAllDone()},[projectTasks])
      ;
    
function deleteTask (task_id)  {
    setUserTasks(userTasks.filter(task => task.id !== task_id))
}
  

  const addNewTask = (useid, projectId, taskObj) => {
    setUserTasks(prevTasks => {
      const updatedTasks = [{ ...taskObj }, ...prevTasks];
      return updatedTasks;
    });
  
    setProjectTasks(prevProjectTasks => {
      const projectToUpdate = prevProjectTasks.find(projectTask => projectTask.projectId === projectId);
  
      if (!projectToUpdate) {
        return prevProjectTasks;
      }
  
      const updatedTasks = [{ ...taskObj }, ...projectToUpdate.tasks];
      const updatedProjectTasks = prevProjectTasks.map(projectTask => {
        if (projectTask.projectId === projectId) {
          return { ...projectTask, tasks: updatedTasks };
        } else {
          return projectTask;
        }
      });
  
      return updatedProjectTasks;
    });
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <Navbar user={user} setUser={setUser} onLogout={handleLogout} />
        <Routes>
          <Route path={`/tasks`} element={<Tasks
            projectTasks={projectTasks}
            setProjectTasks={setProjectTasks}
            changeCompleteOnTaskId={checkCompleted}
            addNewTask={addNewTask}
            deleteTask={deleteTask}
            user={user}
            userProjects={userProjects}
            userTasks={userTasks}
          />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/projects" element={<Projects 
             userProjects={userProjects} 
             projectTasks={projectTasks} 
             booleanCompleted={booleanCompleted}
             />} />
         </Routes>
       </header>
     </div>
   );
 }