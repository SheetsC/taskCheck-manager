// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import { Routes, Route } from 'react-router-dom';
// import { Login } from './Login';
// import { SignUp } from './Signup';
// import { Projects } from './Projects';
// import { Tasks } from './Tasks';

// export function App() {
//   const [user, setUser] = useState(null);
//   const [userProjects, setUserProjects] = useState([]);
//   const [userTasks, setUserTasks] = useState([]);
//   const [projectTasks, setProjectTasks] = useState([]);

//   useEffect(() => {
//     fetch('/check_session').then((response) => {
//       if (response.ok) {
//         response.json().then((user) => setUser(user));
//       }
//     });
//   }, []);
  
//   useEffect(() => {
//     fetch(`/users/${user?.id}/tasks`)
//       .then((r) => r.json())
//       .then((tasks) => {
//           const project_tasks = tasks.map((task) => ({
//           project: task.project,
//           task: task,
//         }));
//         setUserProjects(project_tasks.project)
//         setUserTasks(tasks)
//         setProjectTasks(project_tasks.task);
//       })
//       .catch((error) => console.error(error));
//   }, [user?.id]);

  
//   function handleLogin(user) {
//     setUser(user);
//   }

//   function handleLogout() {
//     fetch('/logout', {
//       method: 'DELETE',
//     }).then(
//       setUser(null)
//     );
//   }

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Navbar user={user} setUser={setUser} onLogout={handleLogout} />
//         <Routes>
//           <Route path="/tasks" element={<Tasks projectTasks={projectTasks} />} />
//           <Route path="/login" element={<Login handleLogin={handleLogin} />} />
//           <Route path="/signup" element={<SignUp setUser={setUser} />} />
//           <Route path="/projects" element={<Projects userProjects={userProjects} />} />
//         </Routes>
//       </header>
//     </div>
//   );
// }
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

  return (
    <div className="App">
      <header className="App-header">
        <Navbar user={user} setUser={setUser} onLogout={handleLogout} />
        <Routes>
          <Route path="/tasks" element={<Tasks projectTasks={projectTasks} userProjects= {userProjects}/>} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/projects" element={<Projects userProjects={userProjects} />} />
        </Routes>
      </header>
    </div>
  );
}