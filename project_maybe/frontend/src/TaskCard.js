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
  projectTasks,
}) {
  const [isComplete, setIsComplete] = useState(complete);

  async function checkAndPatchProjectCompletion() {
    const projectResponse = await fetch(`/projects/${projectId}`);
    const projectData = await projectResponse.json();

    const allTasksCompleted = projectData[0].tasks.every((task) => {
      return task.complete === true;
    });

    const newCompleteValue = allTasksCompleted ? 1 : 0;

    try {
      if (allTasksCompleted) {
        const response = await fetch(`/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ complete: newCompleteValue }),
        });
        if (!response.ok) {
          throw new Error("Failed to update project completion status");
        }
      }
      if (!allTasksCompleted) {
        const response = await fetch(`/projects/${projectId}`, {
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
      const response = await fetch(`/tasks/${id}`, {
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
    fetch(`/tasks/${id}`, {
      method: "DELETE",
    });
  };
  const [otherUserTasks, setOtherUserTasks] = useState([]);

  console.log(otherUserTasks);
  console.log(userProjects);
  return (
    <li class="mt-20 text-base mx-auto rounded-full bg-emerald-500 block max-w-2xl">
      <div className="flex flex-col gap-3">
        <div className="font-sans font-bold">Task:{description}</div>
        <div> Due: {due_date}</div>
        <div className="flex gap-3 items-center">
          <input
            type="checkbox"
            checked={isComplete}
            onChange={toggleComplete}
          />{" "}
          {isComplete ? "complete" : "not done yet"}
        </div>

        <button onClick={handleDelete}>X</button>
      </div>
    </li>
  );
}
