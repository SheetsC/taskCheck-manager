import React from 'react'

export function TaskCard({project, description, complete, due_date}) {
  return (
    <div>
        <h3>Project due:{due_date} Task: {description} {complete ?  "Done": "Not Done"}</h3>
    </div>
  )
}
