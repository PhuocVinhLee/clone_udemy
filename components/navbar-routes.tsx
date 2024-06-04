"use client"
import { UserButton } from '@clerk/nextjs'
 import React from 'react'
 
 const NavbarRoutes = () => {
   return (
     <div className=' flex gap-2 ml-auto'>
        <UserButton></UserButton>
      
     </div>
   )
 }
 
 export default NavbarRoutes
 