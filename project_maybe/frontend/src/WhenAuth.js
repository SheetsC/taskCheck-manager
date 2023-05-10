import React, {useEffect} from 'react'

import { useNavigate } from 'react-router-dom'
export  function WhenAuth({user,children}) {
    const navigate = useNavigate()
    useEffect(() => {
    
        if(!user){
            navigate('/')
        }
    },[navigate, user])
  return (
   
    <div>
         {user && children}
    </div>
  )
}
