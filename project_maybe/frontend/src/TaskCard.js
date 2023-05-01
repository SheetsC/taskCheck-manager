import React, { useState } from 'react';

export function TaskCard({ id, description, complete }) {
  const [isComplete, setIsComplete] = useState(complete);

  const toggleComplete = () => {
    const newCompleteValue = isComplete ? 0 : 1;
    fetch(`/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complete: newCompleteValue })
    })
      .then(() => {
        setIsComplete(!isComplete); // Update the state with the new value
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={isComplete}
          onChange={toggleComplete}
        />
        {description} {isComplete ? 'complete' : 'not done yet'}
      </label>
    </li>
  );
}

