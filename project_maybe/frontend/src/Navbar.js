import React, {useState} from 'react'
import {SlMenu} from 'react-icons/sl'
import {NavLink, Link} from 'react-router-dom'
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navbar({user, setUser, onLogout}) {
    const [nav, setNav] = useState(false)

    const handleNav = () => {
        setNav(!nav)
    } 
    return(
        <header class="bg-slate-900 fixed w-full z-10 top-0">
            <nav class="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
                <div class="hidden lg:flex lg:gap-x-12">
                    <h1 className="NavLink" to='/' end>TaskCheck Manager</h1>
                    <NavLink className="NavLink" to = "./" end>Home <FontAwesomeIcon icon="fa-solid fa-house"/></NavLink>
                    {user ? (
                        <Link className="NavLink" to="/profile">Profile <FontAwesomeIcon icon="fa-solid fa-address-card"/></Link>
                    ) : (
                        <Link className="NavLink" to="/login">Profile <FontAwesomeIcon icon="fa-solid fa-address-card"/></Link>
                    )}
                </div>
                {/* <div class="flex flex-1 items-center justify-end gap-x-6">
                    <Link className="signup" to="/signup">Sign Up</Link>
                </div> */}
                {user ? (
                    <div class="flex justify-between gap-x-6">
                        <p className="logout"><FontAwesomeIcon icon="fa-solid fa-poo"/> Welcome, {user?.first_name}!</p>
                        <Link className="logoutbtn" to="/login" onClick={onLogout}>Logout <FontAwesomeIcon icon="fa-solid fa-power-off"/></Link>
                    </div>
                ) : (
                    <Link className="NavLogin" to="/login">Login <FontAwesomeIcon icon="fa-solid fa-users"/></Link>
                )}
                <button onClick={handleNav} className='text-white block md:hidden'>
                    <SlMenu size={20}/>
                </button>
            </nav>
            <div className={nav ? 'z-10 text-white fixed left-0 top-0 w-[40%] h-full border-r border-stone-400 bg-slate-900 ease-in-out duration-500 md:hidden' : ' fixed left-[-100%]'}>
                <h1 className='w-full medium:text-xl text-2xl font-bold p-4' onClick={handleNav}>
                    <NavLink to='/' end>TaskCheck Manager</NavLink>
                </h1>
            </div>
        </header>
    )
}
export default Navbar