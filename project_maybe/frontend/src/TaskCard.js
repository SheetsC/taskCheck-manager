import React, { useState, useEffect } from "react";

export function TaskCard({
  user,
  userTasks,
  userProjects,
  projectId,
  deleteTask,
  id,
  description,
  due_date,
  complete,
  checkCompleted,
  index
}) {
  const [isComplete, setIsComplete] = useState(complete);

  async function checkAndPatchProjectCompletion() {
    const projectResponse = await fetch(`https://taskcheck-manager.onrender.com/projects/${projectId}`);
    const projectData = await projectResponse.json();

    const allTasksCompleted = projectData[0].tasks.every((task) => {
      return task.complete === true;
    });

    const newCompleteValue = allTasksCompleted ? 1 : 0;

    try {
      if (allTasksCompleted) {
        const response = await fetch(`https://taskcheck-manager.onrender.com/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ complete: newCompleteValue }),
        });
        if (!response.ok) {
          throw new Error("Failed to update project completion status");
        }
      }
      if (!allTasksCompleted) {
        const response = await fetch(`https://taskcheck-manager.onrender.com/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ complete: newCompleteValue }),
        });
        if (!response.ok) {
          throw new Error("Failed to update project completion status");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const toggleComplete = async () => {
    const newCompleteValue = isComplete ? 0 : 1;
    try {
      const response = await fetch(`https://taskcheck-manager.onrender.com/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complete: newCompleteValue }),
      });
      const data = await response.json();
      setIsComplete(!isComplete);
      checkCompleted(data);
      checkAndPatchProjectCompletion();
      // console.log("projectTasks:", projectTasks); // Check value of projectTasks
    } catch (error) {
      // console.error('Error updating task:', error);
    }
  };
  const handleDelete = () => {
    deleteTask(id);
    fetch(`https://taskcheck-manager.onrender.com/tasks/${id}`, {
      method: "DELETE",
    });
  };
  return (
    <li className={`max-w-xs mt-20 cursor-pointer select-none text-base mx-auto rounded-2xl block p-4 hover:shadow-xl ${isComplete ? 'bg-green-500' : 'bg-blue-500 hover:bg-emerald-600'}`}>
  <div className="flex flex-col gap-3">
    <div className="font-sans font-bold">Task {index}: {description}</div>
    <div className="text-sm">Due: {due_date}</div>
    <div className="flex gap-3 items-center">
      <input
        type="checkbox"
        checked={isComplete}
        onChange={toggleComplete}
        className="form-checkbox h-5 w-5 text-emerald-600"
      />
      <span className="text-sm font-medium">{isComplete ? "Complete" : "Not done yet"}</span>
    </div>

    <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Delete</button>
  </div>
</li>
  );
}
