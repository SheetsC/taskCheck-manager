import React, { useState } from 'react';

export function TaskCard({ userProjects ,projectId, deleteTask, id, description, due_date ,complete, checkCompleted, projectTasks }) {
  const [isComplete, setIsComplete] = useState(complete);

  
  function checkAndPatchProjectCompletion() {
    const allTasksCompleted = projectTasks.every(task => {
      return task.complete === true;
    });
    
    const newCompleteValue = isComplete ? 0 : 1
    try {
      if (!allTasksCompleted) {
        fetch(`/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complete: newCompleteValue })
        })
        
        // console.log(`Project ${projectId} marked as completed`);
      } else {
        fetch(`/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ complete: newCompleteValue === 1 ? 0 : 1 })
        });
      }
    } catch (error) {
    
    }
  }
  
  
    
    
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
    console.log(userProjects)
    return (
      <li>
        <label>
          <input
            type="checkbox"
            checked={isComplete}
            onChange={toggleComplete}
          />
          {description} {isComplete ? 'complete' : 'not done yet'}   Due:   {due_date}
          <button onClick={handleDelete}>X</button>
        </label>
      </li>
    );
  }