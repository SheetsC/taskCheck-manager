import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Routes, Route } from 'react-router-dom';
import { Login } from './Login';
import { SignUp } from './Signup';
import { Projects } from './Projects';
import { Tasks } from './Tasks';
import { Home } from './Home';

export function App() {
  const [user, setUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [projectStates, setProjectStates] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // add loading state
  useEffect(() => {
    setIsLoading(true); // set loading to true before making the fetch request
    fetch('https://taskcheck-manager.onrender.com/check_session').then((response) => {
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
    }).finally(() => setIsLoading(false)); // set loading to false when the request is done
  }, [user?.id]);

  useEffect(() => {
    setIsLoading(true);
    if (user?.id) {
      fetch(`https://taskcheck-manager.onrender.com/users/${user.id}`)
        .then(response => response.json())
        .then(userData => {
          // Set user's projects
          setUserProjects(userData.projects);
    
          // Set user's tasks
          const tasks = userData.projects?.flatMap(project => project.tasks);
          setUserTasks(tasks);
  
          // Set project states
          const defaultProjectStates = userData.projects?.reduce((acc, project) => {
            const projectTasks = project?.tasks.map(task => ({
              id: task.id,
              complete: task.complete,
              name: task.name,
            }));
            acc[project.id] = {
              id: project.id,
              name: project.name,
              complete: project.complete,
              tasks: projectTasks,
              end_date: project.end_date,
            };
            return acc;
          }, {});
          setProjectStates(defaultProjectStates);
  
          // Set project tasks
          const projectTasks = {};
          userData.projects?.forEach(project => {
            const projectId = project.id;
            const tasksWithProjectId = project.tasks.map(task => ({ ...task, projectId }));
            projectTasks[projectId] = tasksWithProjectId;
          });
          console.log(projectTasks);
          setProjectTasks(projectTasks);
        })
        .catch(error => console.error(error))
        .finally(() => setIsLoading(false));
    } else {
      setUserProjects([]);
      setUserTasks([]);
      setProjectStates([]);
      setProjectTasks({});
      setIsLoading(false);
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
  function checkCompleted(likedObj) {
    const updatedTask = {
      ...likedObj,
      completed: !likedObj.completed
    };
    const updatedTasks = [...userTasks.filter((task) => task.id !== likedObj.id), updatedTask];
  
    setUserTasks(updatedTasks);
  
    const updatedProjects = userProjects.map((project) => {
      const tasksForProject = updatedTasks.filter((task) => task.project_id === project.id);
      const projectComplete = tasksForProject.every((task) => task.completed);
      return {
        ...project,
        completed: projectComplete,
      };
    });
  
    setUserProjects(updatedProjects);
  }
  
    
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
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Routes>
            <Route path= "/" element={<Home user={user} userTasks={userTasks}/>} />
            <Route path={`/tasks`} element={<Tasks
              projectTasks={projectTasks}
              setProjectTasks={setProjectTasks}
              checkCompleted={checkCompleted}
              addNewTask={addNewTask}
              deleteTask={deleteTask}
              user={user}
              userProjects={userProjects}
              userTasks={userTasks}/>}
             />
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="/projects" element={<Projects 
              userProjects={userProjects} 
              projectTasks={projectTasks}
              projects={userProjects}
              setProjects={setUserProjects}
              projectStates={projectStates} // Pass the project state object as a prop
              setProjectStates={setProjectStates}
              user={user} // Pass the setter function for the project state object as a prop
              userTasks={userTasks}/>} 
            />
        </Routes>

        )}
      </header>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

    </div>
  );
}