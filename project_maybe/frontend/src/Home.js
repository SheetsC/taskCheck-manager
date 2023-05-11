import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Link } from 'react-router-dom';
import MyCalendar from './MyCalendar';

export function Home({ user, userTasks }) {
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Simulate checking the session
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    user ?(
      <div className='text-center my-6 cursor-default select-none font-sans text-xl'>
        <h1>Hello, {user.name}. Days with tasks due have been marked.<br/> Navigate to Projects to see which ones need work.</h1>
        <MyCalendar user={user} userTasks={userTasks}/>
      </div>
    ) :
    (
      <div className="flex h-screen items-center flex-col mt-24">
        <h1 className="text-3xl font-bold mb-10 cursor-default select-none py-10 px-4" >TaskCheck Manager</h1>
        <Link to="/login" className="mx-auto">
          <button className="bg-violet-500 w-48 text-white rounded-full px-6 py-4 select-none">
            Login
          </button>
        </Link>
      </div>
    )
  );
}


