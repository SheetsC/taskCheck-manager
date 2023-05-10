import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function TaskForm({ projectId, user, addNewTask }) {
  const formSchema = Yup.object().shape({
    description: Yup.string().required('Required'),
    dueDate: Yup.date().required('Required'),
    status: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      description: '',
      dueDate: '',
      status: '',
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      const newTask = {
        description: values.description,
        due_date: values.dueDate,
        status: values.status,
        complete: true,
        project_id: projectId,
        user_id: user.id,
      };

      fetch(`/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
        .then((r) => r.json())
        .then((data) => {
          console.warn(data);
          addNewTask(user.id, projectId, data);
          resetForm()
        });
    },
  });

  return (
    <div className="mx-auto font-sans text-center justify-between gap-x-6 p-6 lg:px-8">
      <div className="mx-10 mb-8 border rounded shadow-sm p-6">
        <h2 className="p-6 my-3 text-4xl font-bold">Add a Task</h2>
        <form onSubmit={formik.handleSubmit} className="mx-auto mt-6 max-w-lg grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="description" className="block text-sm font-semibold font-sans leading-6 text-gray-900">Description</label>
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
            <label htmlFor="dueDate" className="block text-sm font-sans leading-6 text-gray-900">Due</label>
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
          <div className="w-full">
            <label htmlFor="status" className="block text-sm font-semibold font-sansleading-6 text-gray-900">Status</label>
            <input
              type="text"
              name="status"
              id="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ${formik.touched.status && formik.errors.status ? "ring-red-500" : "ring-slate-300"} focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6`}
            />
            {formik.touched.status && formik.errors.status && (
              <div className="text-red-500">{formik.errors.status}</div>
            )}
          </div>
          <button type="submit" className="block w-full font-sans rounded-md bg-blue-500 px-3.5 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500">Add Task</button>
            </form>
        </div>
        </div>
    )
}