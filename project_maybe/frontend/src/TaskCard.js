import React, { useState } from 'react';

export function TaskCard({ deleteTask, id, description, complete, projectId, changeCompleteOnTaskId, projectTasks }) {
  const [isComplete, setIsComplete] = useState(complete);

  const toggleComplete = () => {
    
    const newCompleteValue = isComplete ? 0 : 1;
    fetch(`/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complete: newCompleteValue })
    })
      .then((data) => {
        ; setIsComplete(!isComplete)
        changeCompleteOnTaskId(data);
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  const handleDelete=()=>{
      deleteTask(id)
      fetch(`/tasks/${id}`, {
        method: 'DELETE',
    })}
  
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

