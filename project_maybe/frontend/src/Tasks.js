// import React, { useState } from 'react';

// export function Tasks({ projectTasks, userProjects }) {
//   const tasks = projectTasks.map(task => task.tasks);
//   const flatTasks = tasks.flatMap((nestedArray) => nestedArray);
//   const projects = flatTasks.map(task => task.project.name);

//   // State to keep track of completed tasks
//   const [completedTasks, setCompletedTasks] = useState([]);

//   // Function to handle checkbox click event
//   const handleCheckboxClick = (taskId) => {
//     const taskIndex = flatTasks.findIndex(task => task.id === taskId);
//     if (taskIndex !== -1) {
//       const updatedTask = { ...flatTasks[taskIndex], complete: !flatTasks[taskIndex].complete };
//       const updatedTasks = [...flatTasks];
//       updatedTasks[taskIndex] = updatedTask;
//       setCompletedTasks(updatedTasks.filter(task => task.complete));
//     }
//   };

//   return (
//     <div>
//       <h1>Tasks for {projects[0]}</h1>
//       <ul>
//         {flatTasks.map(task => (
//           <li key={task.id}>
//             <input type="checkbox" checked={task.complete} onChange={() => handleCheckboxClick(task.id)} />
//             {task.description} {task.complete ? "complete " : "not done yet"}
//           </li>
//         ))}
//       </ul>
//       <p>{completedTasks.length} out of {flatTasks.length} tasks completed</p>
//     </div>
//   );
//}
//   const tasks = [[{id: 1, name:'adam'}],[{id: 2, name:'steve'}],[{id: 3, name:'connor'}]]
import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
export function Tasks({ projectTasks, userProjects }) {
  const tasks = projectTasks.map(task => task.tasks);
  const flatTasks = tasks.flatMap((nestedArray) => nestedArray);
  const projects = flatTasks.map(task => task.project.name);
  
  
  
  const taskComponents = 
  flatTasks.map((task) => {
      return(
          <TaskCard {...task}/>
      )
  })
  // Function to toggle the completed status of a task
;

  return (
    <div>
      <h1>Tasks for {projects[0]}</h1>
      <ul>
        {taskComponents}
      </ul>
    </div>
  );
}
