import React from 'react'

export function Logout({handleLogout}) {
  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

