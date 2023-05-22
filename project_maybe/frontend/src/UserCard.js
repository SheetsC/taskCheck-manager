import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

export default function UserCard({ id, name, logged_in, username, client }) {
  const [projects, setProjects] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`/users/${id}/projects`)
      .then((r) => r.json())
      .then((data) => setProjects(data));
  }, [client?.id]);

  const seeProjects = () => {
    setShowModal(!showModal);
  };

  return (
    <div className='max-w-sm flex rounded-lg bg-teal-300'>
      <h2>Name:{name} ID:{id}<br/> Username:{username}</h2>
      <h3>{logged_in ? 'Logged in' : 'Not Logged in'}</h3>
      <button className='bg-teal-500 rounded-full'onClick={seeProjects}>Show Projects</button>
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={seeProjects}
        contentLabel='Project Info'
        className='bg-inherit'
      >
        <h2>Project Info:</h2>
        <div className='grid grid-cols-2 gap-3 mx-auto'>
        {projects?.map((project) => (
          <div className=' bg-rose-700 rounded-lg mx-auto'key={project?.id}>
            <h3>{project?.name}</h3>
            <p>{project?.description}</p>
            <div className="grid grid-cols-4 gap-3 mx-auto">
              {project?.tasks.map((task) => {
                return (
                  <li className={`max-w-xs cursor-pointer select-none text-base mx-auto rounded-2xl block p-4 hover:shadow-xl ${task.complete ? 'bg-green-500' : 'bg-blue-500 hover:bg-emerald-600'}`}>
                <div>
                  <div className="font-sans font-bold">Task {task.index}: {task.description}</div>
                  <div className="text-sm">Due: {task.due_date}</div>
                  <div className="text-sm">User ID: {task?.user_id}</div>
                  <div className="flex gap-3 items-center">
                
                    <span className="text-sm font-medium">{task.complete ? "Complete" : "Not done yet"}</span>
                  </div>
                </div>
              </li>
                );
                })}
            </div>
            <hr className='bg-red-950' />
          </div>
        ))}
        </div>
        <button onClick={seeProjects}>Close</button>
      </Modal>

      
    </div>
  );
}
