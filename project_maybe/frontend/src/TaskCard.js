import React, { useState } from 'react';

export function TaskCard({ projectId, deleteTask, id, description, complete, checkCompleted, projectTasks }) {
  const [isComplete, setIsComplete] = useState(complete);


  async function checkAndPatchProjectCompletion() {
    const allTasksCompleted = projectTasks.every(task => {
      return task.complete === true;
    });
    console.log(allTasksCompleted);
    console.log(projectTasks);
    const newCompleteValue = isComplete ? 0 : 1
    try {
      if (!allTasksCompleted) {
        await fetch(`/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complete: newCompleteValue })
        });
        // console.log(`Project ${projectId} marked as completed`);
      } else {
        await fetch(`/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complete: newCompleteValue })
        });
        // console.log(`Project ${projectId} marked as incomplete`);
      }
    } catch (error) {
      // console.error(`Error updating project ${projectId}:`, error);
    }
  }
  
  
  
    console.log("isComplete:", isComplete); // Check initial value of isComplete
  
    const toggleComplete = async () => {
      const newCompleteValue = isComplete ? 0 : 1;
      try {
        const response = await fetch(`/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complete: newCompleteValue })
        });
        const data = await response.json();
        setIsComplete(!isComplete);
        checkCompleted(data);
        await checkAndPatchProjectCompletion();
        // console.log("projectTasks:", projectTasks); // Check value of projectTasks
        const allTasksCompleted = projectTasks.every(task => task.complete === true);
        // console.log("allTasksCompleted:", allTasksCompleted); // Check value of allTasksCompleted
        if (allTasksCompleted) {
          await fetch(`/projects/${projectId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ complete: 1 })
          });
          // console.log(`Project ${projectId} marked as completed`);
        }
      } catch (error) {
        // console.error('Error updating task:', error);
      }
    };
    const handleDelete = () => {
      deleteTask(id);
      fetch(`/tasks/${id}`, {
        method: 'DELETE',
      });
    }
  
    return (
      <li>
        <label>
          <input
            type="checkbox"
            checked={isComplete}
            onChange={toggleComplete}
          />
          {description} {isComplete ? 'complete' : 'not done yet'}
          <button onClick={handleDelete}>X</button>
        </label>
      </li>
    );
  }