import { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import './index.css';


export function ClientLogin({ handleLogin }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };


  const handleShow = () => {
    setShow(!show)
  }

  const nagigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        // body: JSON.stringify({ username}),
            body: JSON.stringify({ name, company, password }),
        }).then((r) => {
            if (r.ok) {
                r.json().then((client) => handleLogin(client))
                nagigate('/')
            }
            else {
                toggleModal()
            }
        });
    }

    return (
        <div >
            <form onSubmit={handleSubmit} class="mx-auto mt-16 max-w-sm sm:mt-20">
                <div class="mx-auto max-w-2xl text-center justify-between gap-x-6 p-6 lg:px-8">
                    <h2 class="text-3xl font-bold cursor-default select-none tracking-tight text-violet-500 sm:text-5xl">Login</h2>
                </div>
                <div>
                    <label for="name" class="block text-sm font-semibold leading-6 text-violet-500 cursor-default select-none">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        class="block w-full rounded-full border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                    />
                </div>
                <div>
                    <label for="company" class="block text-sm font-semibold leading-6 text-violet-500 cursor-default select-none">Company</label>
                    <input
                        type="text"
                        name="company"
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        class="block w-full rounded-full border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                    />
                </div>
                <div class="z-0 relative w-full">
                    <label className="cursor-default text-violet-500 text-select-none" htmlFor="password">Password: </label>
                    <div class="absolute inset-y-11 right-0 flex items-center px-2">
                        <span class="z-auto cursor-pointer select-none" onClick={handleShow}>
                        {show ? "🙊":"🙈"}
                        </span>
                    </div>
                    <div>
                        <input
                            type={show ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            class="block w-full rounded-full border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6 js-password"
                        />
                    </div>
                </div>
                <div class="mt-10">
                    <button type="submit" class="block w-full rounded-full bg-violet-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Login</button>
                    {/* <Link to="/events"><button type="submit" class="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Login</button></Link> */}
                </div>
                <div class="mx-auto  text-violet-500 flex items-center cursor-default select-none  gap-x-2">
                    <p>Don't have an account?</p>
                    <Link className="signupbtn" to="/signup">Sign Up!</Link>
                </div>
            </form>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded shadow p-4 cursor-default select-none text-center">
                        <h2>Stop Right There!!!</h2>
                        <p className='mb-2 cursor-default select-none'>You are an impostor and have no acount.</p>
                        <button onClick={toggleModal} className="hover:bg-slate-900 hover:text-white border shadow font-bold px-4 rounded">Try Again</button>
                    </div>
                </div>
            )}
        </div>
    );
}