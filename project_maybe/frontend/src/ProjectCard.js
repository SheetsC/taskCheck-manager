import React from 'react'
import {Link} from 'react-router-dom'

export function ProjectCard({id, name, end_date, complete }) {
  return (
    
    <Link to={`/tasks/`}>
        <h3>Project:{name} Due: {end_date} {complete ?  "Done": "Not Done"}</h3>
    </Link>
  )
}
