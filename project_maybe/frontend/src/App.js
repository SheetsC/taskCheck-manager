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
  const [isLoading, setIsLoading] = useState(true); // add loading state

  useEffect(() => {
    setIsLoading(true); // set loading to true before making the fetch request
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
    }).finally(() => setIsLoading(false)); // set loading to false when the request is done
  }, [user?.id]);

  useEffect(() => {
    setIsLoading(true); // set loading to true before making the fetch request
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
            const tasksWithProjectId = project.tasks.map(task => ({ ...task, projectId }));
            projectTasks[projectId] = tasksWithProjectId;
          });
          console.log(projectTasks);
          setProjectTasks(projectTasks);
        })
        .catch(error => console.error(error))
        .finally(() => setIsLoading(false)); // set loading to false when the request is done
    } else {
      setUserProjects([]);
      setUserTasks([]);
      setProjectTasks({});
      setIsLoading(false); // set loading to false when there is no user
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
  function checkCompleted(likedObj, callback) {
    const taskLiked = projectTasks.map((taskObj) =>
      taskObj.id === likedObj.id ? likedObj : taskObj
    );
    setProjectTasks(taskLiked);
    setUserTasks(taskLiked);
  
    
  
    const updatedProjects = userProjects.map((project) => {
      const tasksForProject = taskLiked.filter((task) => task.project_id === project.id);
      const projectComplete = tasksForProject.every((task) => task.completed);
      return {
        ...project,
        completed: projectComplete,
      };
    });
  
    setProjectTasks(taskLiked);
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
          <Route path={`/tasks`} element={<Tasks
            projectTasks={projectTasks}
            setProjectTasks={setProjectTasks}
            checkCompleted={checkCompleted}
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
            
            />} />
        </Routes>
        )}
      </header>
    </div>
  );
}