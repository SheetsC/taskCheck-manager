import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

export function Tasks({ projectTasks, changeCompleteOnTaskId, user, addNewTask}) {
  const [showForm, setShowForm] = useState(false);

  const seeTaskForm = () => {
    setShowForm(!showForm);
  };

  const tasks = [...projectTasks].map(task => task.tasks).flat();
  const project_id = projectTasks.length > 0 ? projectTasks[0].tasks[0].project.id : "";
  const projectName = projectTasks.length > 0 ? projectTasks[0].tasks[0].project.name : "";

  const uniqueTasks = tasks.reduce((acc, task) => {
    const existingTaskIndex = acc.findIndex(t => t.id === task.id && t.dueDate === task.dueDate && t.description === task.description);
    if (existingTaskIndex === -1) {
      acc.push(task);
    } else {
      acc[existingTaskIndex] = task;
    }
    return acc;
  }, []);

  const taskComponents = tasks.map((task) => {
    return (
      <TaskCard
        key={task.id}
        {...task}
        changeCompleteOnTaskId={changeCompleteOnTaskId}
      />
    );
  });

  return (
    <div>
      <h1>
        Tasks for {projectName}
        <button onClick={seeTaskForm}>+</button>
        {showForm ? (<TaskForm key={1} projectId = {project_id} addNewTask={addNewTask} user={user}/>) : null}
      </h1>
      <ul>{taskComponents}</ul>
    </div>
  );
}