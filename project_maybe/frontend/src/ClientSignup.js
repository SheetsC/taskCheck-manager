import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import {useFormik} from "formik"
import * as yup from "yup"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export function ClientSignUp({ setClient }) {
    const navigate = useNavigate()
    const formSchema = yup.object().shape({
        company: yup
        .string()
        .required('required'),
        password: yup
        .string()
        .required('required')
        .min(8, 'Password must be 8 characters long')
        .matches(/[0-9]/, 'Password requires a number')
        .matches(/[a-z]/, 'Password requires a lowercase letter')
        .matches(/[A-Z]/, 'Password requires an uppercase letter')
        .matches(/[^\w]/, 'Password requires a symbol'),
        name: yup
        .string()
        .required('required')
    })

    const formik = useFormik({
        initialValues: {
        company: "",
        password: "",
        name: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/clients/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            }).then((r) => {
                if (r.ok) {
                    r.json().then((client) => setClient(client));
                }
            });
            navigate('/login')
        },
    });

    const [show, setShow] = useState(false)

    const handleShow = () => {
        setShow(!show)
    }


    return (
        <div class='mt-28'>
            <form onSubmit={formik.handleSubmit} class="mx-auto mt-16 max-w-sm sm:mt-20">
                <div class="mx-auto max-w-2xl text-center justify-between gap-x-6 p-6 lg:px-8">
                    <h2 class="text-3xl font-bold tracking-tight text-blue-700 sm:text-5xl">Sign Up</h2>
                </div>
                <label class=' text-blue-700'for="company">Company </label>
                <input
                type="text"
                name="company"
                id="company"
                autoComplete="off"
                value={formik.values.company}
                onChange={formik.handleChange}
                class="block w-full rounded-full border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                />
                <p style={{ color: "red" }}> {formik.errors.company}</p>
                <div class="relative w-full">
                    <label  class=' text-blue-700'htmlFor="password">Password</label>
                    <div class="absolute inset-y-11 right-0 flex items-center px-2">
                        <input class="hidden js-password-toggle" id="toggle" type="checkbox" />
                        <span class="z-auto ">
                            {show ? <FontAwesomeIcon icon="fa-solid fa-eye" onClick={handleShow}/> :  <FontAwesomeIcon icon="fa-solid fa-eye-slash" onClick={handleShow}/>
                            }
                        </span>
                    </div>
                    <input
                        type={show ? "text" : "password"}
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoComplete="current-password"
                        class="block w-full rounded-full border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6 js-password"
                    />
                    <p style={{ color: "red" }}> {formik.errors.password}</p>
                </div>

                <label class=' text-blue-700'for="name"> Name</label>
                <input
                type="text"
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                class="block w-full rounded-full border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                />
                <p style={{ color: "red" }}> {formik.errors.name}</p>

                <div class="mt-10">
                    <button type="submit" class="block w-full rounded-full bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Submit</button>
                </div>
            </form>
        </div>
    );
}