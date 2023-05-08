import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
export  function WhenAuth({user,children}) {
    const navigate = useNavigate()
    useEffect(() => {
    
        if(!user){
            navigate('/')
        }
    },[user])
  return (
   
    <div>
         {user && children}
    </div>
  )
}
