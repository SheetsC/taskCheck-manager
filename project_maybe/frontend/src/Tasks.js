import React, { useState } from 'react';
import { TaskCard } from './TaskCard';

export function Tasks({ projectTasks, changeCompleteOnTaskId }) {
    const tasks = projectTasks.map(task => task.tasks).flat();
    const projectName = projectTasks.length > 0 ? projectTasks[0].tasks[0].project.name : "";
  
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
        <h1>Tasks for {projectName}</h1>
        <ul>{taskComponents}</ul>
      </div>
    );
  }