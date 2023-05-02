import React,{useState} from 'react'

export function TaskForm({projectId, user, addNewTask}) {
    
    
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [status, setStatus] = useState('')
    const [complete, setComplete] = useState('')
    // const [project, setProject] = useState(projectId)

    const handleAddTask = (e) => {
        e.preventDefault()

        const newTask = {
            description: description,
            due_date: dueDate,
            status: status,
            complete: false,
            project_id: projectId,
            user_id: user.id
        }
        console.log(newTask)
        // addEvent(newEvent)
        const key = Date.now()

        fetch(`/projects/${projectId}/users/${user.id}/tasks`, {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(newTask)
        })
        .then(r=>r.json())
        .then(data => {
            console.warn(data)
            addNewTask(user.id, projectId, data)
        })
    }

    return(
        <div class="mx-auto text-center justify-between gap-x-6 p-6 lg:px-8">
            <div class='mx-10 mb-8 border rounded shadow-sm p-6'>
                <h2 class='p-6 my-3 text-4xl font-bold'>Add a Task</h2>
                <form onSubmit={handleAddTask} class="mx-auto mt-6 max-w-lg grid grid-cols-2 gap-4">
                <div>
                    <label for="Description" class="block text-sm font-semibold leading-6 text-gray-900">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                    />
                </div>
                <div>
                    <label for="DueDate" class="block text-sm font-semibold leading-6 text-gray-900">Due</label>
                    <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                    />
                </div>
                <div>
                    <label for="Status" class="block text-sm font-semibold leading-6 text-gray-900">Status</label>
                    <input
                        type="text"
                        name="status"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                    />
                </div>
                <div>
                <label for="complete" class="block text-sm font-semibold leading-6 text-gray-900">Complete</label>
                <input
                    type="checkbox"
                    name="complete"
                    id="complete"
                    checked={complete}
                    onChange={(e) => setComplete(e.target.checked)}
                    class="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-amber-400 sm:text-sm sm:leading-6"
                />
                </div>
                <button type="submit" class="block w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">Add Task</button>
                </form>
            </div>
        </div>
    )
}
