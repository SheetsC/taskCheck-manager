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
        response.json().then((user) => setUser(user));
      }
    });
  }, []);
//fetch to user project to get task but include tasks for project in serialize
  useEffect(() => {
    fetch(`/users/${user?.id}/tasks`)
      .then((r) => r.json())
      .then((tasks) => {
        setUserTasks(tasks);
        const projectNames = [...new Set(tasks.map((task) => task.project))];
        setUserProjects(projectNames);
        const projectTasks = projectNames.map((project) => ({
          tasks: tasks.filter((task) => task.project === project),
        }));
        setProjectTasks(projectTasks);
      })
      .catch((error) => console.error(error));
  }, [user?.id]);

  function handleLogin(user) {
    setUser(user);
  }

  function handleLogout() {
    fetch('/logout', {
      method: 'DELETE',
    }).then(() => setUser(null));
  }

  function changeCompleteOnTaskId(taskId, projectId, isComplete) {
    setProjectTasks(prevProjectTasks => {
      const updatedProjectTasks = prevProjectTasks.map(projectTask => {
        if (projectTask.projectId === projectId) {
          const updatedTasks = projectTask.tasks.map(task => {
            if (task.id === taskId) {
              return {...task, complete: isComplete};
            } else {
              return task;
            }
          });
          return {...projectTask, tasks: updatedTasks};
        } else {
          return projectTask;
        }
      });
      return updatedProjectTasks;
    });
  }
  //refactor when i have my projects
  const addNewTask = (userId, projectId, taskObj) => {
    setProjectTasks((prevProjectTasks) => {
      const updatedProjectTasks = prevProjectTasks.map((projectTask) => {
        if (projectTask.tasks[0]?.project.id === projectId) {
          const updatedTasks = [...projectTask.tasks, { ...taskObj, userId }];
          return { ...projectTask, tasks: updatedTasks }; // Add projectId property
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
          <Route path="/tasks" element={<Tasks  
            projectTasks={projectTasks} 
            changeCompleteOnTaskId={changeCompleteOnTaskId}  
            addNewTask={addNewTask}
            user={user}
          />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/projects" element={<Projects 
            userProjects={userProjects} 
            projectTasks={projectTasks} />} />
        </Routes>
      </header>
    </div>
  );
}