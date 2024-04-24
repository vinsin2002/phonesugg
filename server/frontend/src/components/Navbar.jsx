import React from 'react'
import Link from 'next/link'
import Button from './Button'
import { auth } from '@/lib/auth'
import { githubSignOutInHandler } from '@/lib/actions';
async function Navbar() {
  const session = await auth();
  return (
    <div className='w-full h-14 border bg-transparent flex justify-between items-center'>
        <div className='flex'>
          <Link href='/' className='ml-5'>Home</Link>
          <p className='ml-2'>/</p>
          <Link href='/analytics' className='ml-2'>Analytics</Link>    
        </div>
        <div className=''>
          { session ? <form action={githubSignOutInHandler} className='flex flex-row justify-center items-center'><h1 className='text-black '>{session.user.name}</h1><button type='submit' className='bg-orange-500 p-2 m-5 rounded-md text-white'>logout</button></form>
           : <Link href='/login' className='bg-teal-600 p-2 m-5 rounded-md text-white'>Login</Link>}
        </div>
    </div>
  )
}

export default Navbar