import React from 'react'
import UserCard from './UserCard'

export function Users({client ,clientUsers}) {
    console.log(clientUsers)
    const userComponents = clientUsers.map(user => {
        return (
            <UserCard {...user} client={client}/>
        )
    })
    

  return (
    client? (<div className='text-blue-800 flex rounded-lg mx-20 scroll-smooth' >{userComponents}</div>) : (null)
    
  )
}
