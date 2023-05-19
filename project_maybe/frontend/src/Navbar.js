import React, { useState, useEffect } from 'react';
import { SlMenu } from 'react-icons/sl';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './index.css';

function Navbar({ user, onLogout, client}) {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const location = useLocation();

  useEffect(() => {
    setNav(false);
  }, [location]);

  return (
    <header className=" flex w-full cursor-default select-none z-10 text-violet-500 top-0">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="hidden lg:flex lg:gap-x-12">
          {user ? (
            <Link className="NavLink font-color" to={`/${user.username}/projects`}>
              Projects 
            </Link>
          ) : client ? (
            <Link className="NavLink font-color" to={`/${client.name}/projects`}>
              Projects 
            </Link>
            ):(
            <Link className="NavLink" to="/">
              Home
            </Link>
          )
          }
        </div>
        {user? (
        <div>
          <Link className="NavLink" to="/">
              Home
          </Link>
        </div>
        ):client? (
        <div>
          <Link className="NavLink" to="/">
              Home
          </Link>
        </div>
        ):(null)
        }
        { client ? (<Link className='NavLink' to={`/${client.name}/users`}>  
            My Users
          </Link>):(null)}
          {
          <div className="flex justify-between gap-x-6">

            <Link className="logoutbtn" to="/" onClick={onLogout}>
              Logout 
            </Link>
          </div>
        }
        <button onClick={handleNav} className="text-white block md:hidden">
          <SlMenu size={20} />
        </button>
      </nav>
      <div
        className={
          nav
            ? 'z-10 text-white fixed left-0 top-0 w-[40%] h-full border-r border-stone-400 bg-slate-900 ease-in-out duration-500 md:hidden'
            : ' fixed left-[-100%]'
        }
      >
        <h1 className="w-full medium:text-xl text-2xl font-bold p-4" onClick={handleNav}>
          <NavLink to="/" end>
            TaskCheck Manager
          </NavLink>
        </h1>
      </div>
    </header>
  );
}

export default Navbar;