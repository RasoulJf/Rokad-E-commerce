import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Authorization() {
  return (
    <div className='flex justify-center items-center h-[100vh]'>
      <Outlet/>
    </div>
  )
}
