import React, { useState } from 'react';
import { Login } from './Login';
import { Link } from 'react-router-dom';

export function Home({ user }) {
  const [show, setShow] = useState(true);

  const handleStart = () => {
    setShow(!show);
  };

  return (
    <div className="flex h-screen items-center flex-col mt-24">
      <h1 className="text-3xl font-bold mb-10 py-10 px-4" >TaskCheck Manager</h1>

      <Link to="/login" className="mx-auto">
        <button className="bg-violet-500 w-48 text-white rounded-full px-6 py-4">
          Login
        </button>
      </Link>
    </div>
  );
}


