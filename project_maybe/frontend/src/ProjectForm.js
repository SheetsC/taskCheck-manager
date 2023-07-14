import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function ProjectForm({ user, addNewProject }) {
  const formSchema = Yup.object().shape({
    description: Yup.string().required('Required'),
    dueDate: Yup.date().required('Required'),
    name: Yup.string().required('Required'),
    endDate: Yup.date().required('Required'),
    startDate: Yup.date().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      description: '',
      dueDate: '',
      status: '',
      name: '',
      endDate: '',
      startDate: ''
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
        console.log("submit works")
      const newProject = {
        name: values.name,
        start_date: values.startDate,
        end_date: values.endDate,
        complete: false,
        tasks: []
      }
      const newTask = {
        description: values.description,
        due_date: values.dueDate,
        complete: false,
        user_id: user.id,
      };

      fetch(`/users/${user.id}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({project: newProject, task: newTask}),
      })
        .then((r) => r.json())
        .then((data) => {
          console.warn(data);
          newProject.id =data.project_id
          newTask.id = data.task_id
          newProject.tasks.push(newTask)
          addNewProject(newProject, newTask) 
          resetForm()
        });
    },
  });

  return (
    <div className="mx-auto font-sans text-center justify-between gap-x-6 p-6 lg:px-8">
      <div className="mx-10 mb-8 border-none shadow-sm p-6">
        <h2 className="p-6 my-3 text-yellow-500 text-4xl font-bold">Add a Project</h2>
        <form onSubmit={formik.handleSubmit} className="mx-auto mt-6 max-w-lg grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold font-sans leading-6  text-yellow-500">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ${formik.touched.name && formik.errors.name ? "ring-red-500" : "ring-slate-300"} focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-sans leading-6  text-yellow-500">Start Date</label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full rounded-md border-0 font-sanspx-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ${formik.touched.startDate && formik.errors.startDate ? "ring-red-500" : "ring-slate-300"} focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6`}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-500">{formik.errors.startDate}</div>
            )}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-sans leading-6  text-yellow-500">End Date</label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full rounded-md border-0 font-sanspx-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ${formik.touched.endDate && formik.errors.endDate
                 ? "ring-red-500" : "ring-slate-300"} focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6`}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="text-red-500">{formik.errors.endDate}</div>
            )}
          </div>
          <br/><h1 className="text-blue-300">First task for project</h1><br/>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold font-sans leading-6  text-yellow-500">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ${formik.touched.description && formik.errors.description ? "ring-red-500" : "ring-slate-300"} focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6`}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500">{formik.errors.description}</div>
            )}
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-sans leading-6  text-yellow-500">Due</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={formik.values.dueDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full rounded-md border-0 font-sanspx-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ${formik.touched.dueDate && formik.errors.dueDate ? "ring-red-500" : "ring-slate-300"} focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6`}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <div className="text-red-500">{formik.errors.dueDate}</div>
            )}
          </div>
          
          <button type="submit" className="block w-full font-sans rounded-md bg-yellow-500 px-3.5 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500">Add</button>
            </form>
        </div>
        </div>
    )
}