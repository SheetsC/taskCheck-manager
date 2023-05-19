import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Routes, Route } from 'react-router-dom';
import { UserLogin } from './UserLogin';
import { UserSignUp } from './UserSignup';
import { ClientSignUp } from './ClientSignup';
import { Projects } from './Projects';
import { Tasks } from './Tasks';
import { Home } from './Home';
import { ClientLogin } from './ClientLogin';
import { Users } from './Users';

export function App() {
  const [user, setUser] = useState(null)
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [projectStates, setProjectStates] = useState([]);
  const [client, setClient] = useState(null);
  const [clientUsers, setClientUsers] = useState([]);
  const [clientProjects, setClientProjects] = useState([])
  const [clientTasks, setClientTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // add loading state
  useEffect(() => {
    setIsLoading(true); // set loading to true before making the fetch request
    fetch('/check_session').then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data?.company)
          console.log(data?.username)
          if(data?.company){
            sessionStorage.setItem('client', JSON.stringify(data));
            setClient(data);
          }
          else if(data?.username){
            sessionStorage.setItem('user', JSON.stringify(data));
            setUser(data)
          }
        });
      } else {
        const userFromLocalStorage = localStorage.getItem('user');
        if (userFromLocalStorage) {
          setUser(JSON.parse(userFromLocalStorage));
        }
        else{
          setClient(JSON.parse(localStorage.getItem('client')));
        }
      }
    }).finally(() => setIsLoading(false)); // set loading to false when the request is done
  }, [user?.id, client?.id]);

  useEffect(() => {
    setIsLoading(true);
    if (user?.id) {
      fetch(`/users/${user?.id}`)
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
    } else if(client?.id ){
      fetch(`/clients/${client?.id}`)
      .then(r=>r.json())
      .then(client=> {
        setClient(client)
        setClientProjects(client.projects)
        setClientUsers(client.users)
        setClientTasks(client.projects.map(project => project.tasks))
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
    }else{
      setUserProjects([]);
      setUserTasks([]);
      setProjectStates([]);
      setProjectTasks({});
      setIsLoading(false);
    }
  }, [user?.id || client?.id]);

  function handleLogin(data) {
    if(data.username){
      setUser(data);
    } else if(data.company){
      setClient(data);
    }
  }

  function handleLogout() {
    fetch('/logout', {
      method: 'DELETE',
    }).then(() => {
      setUser(null)
      setClient(null)
    });
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
        <Navbar user={user} client={client} setUser={setUser} setClient={setClient} onLogout={handleLogout} />
        {isLoading ? (
          <p className='text-white'>Loading...</p>
        ) : (
          <Routes>
            <Route path= "/" element={<Home 
              user={user} 
              client={client} 
              userTasks={userTasks}
              clientProjects ={clientProjects}
              />} />
            <Route path={`/${user?.username}/tasks`} element={<Tasks
              projectTasks={projectTasks}
              setProjectTasks={setProjectTasks}
              checkCompleted={checkCompleted}
              addNewTask={addNewTask}
              deleteTask={deleteTask}
              user={user}
              userProjects={userProjects}
              userTasks={userTasks}/>}
             />
             <Route path={`/${client?.name}/tasks`} element={<Tasks
              projectTasks={projectTasks}
              setProjectTasks={setProjectTasks}
              checkCompleted={checkCompleted}
              addNewTask={addNewTask}
              deleteTask={deleteTask}
              user={user}
              userProjects={userProjects}
              userTasks={userTasks}/>}
             />
            <Route path="/users/login" element={<UserLogin handleLogin={handleLogin} />} />
            <Route path="/clients/login" element={<ClientLogin handleLogin={handleLogin} />} />
            <Route path="/users/signup" element={<UserSignUp setUser={setUser} />} />
            <Route path="/clients/signup" element={<ClientSignUp setUser={setUser} />} />
            <Route path={`/${user?.username}/projects`} element={<Projects 
              userProjects={userProjects} 
              projectTasks={projectTasks}
              projects={userProjects}
              setProjects={setUserProjects}
              projectStates={projectStates} // Pass the project state object as a prop
              setProjectStates={setProjectStates}
              user={user} // Pass the setter function for the project state object as a prop
              userTasks={userTasks}/>} 
            />
            <Route path={`/${client?.name}/projects`} element={<Projects 
              userProjects={userProjects} 
              projectTasks={projectTasks}
              projects={userProjects}
              setProjects={setUserProjects}
              projectStates={projectStates} // Pass the project state object as a prop
              setProjectStates={setProjectStates}
              user={user} // Pass the setter function for the project state object as a prop
              userTasks={userTasks}/>
            } 
            />
            <Route path={`/${client?.name}/users`} element={<Users client={client} clientUsers={clientUsers}/>}
              
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