import React from 'react'
import Link from 'next/link';
import GithubSignInForm from '@/components/GithubSignInForm';
import LoginForm from '@/components/LoginForm';

async function page() {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        <LoginForm/>
        <GithubSignInForm/>
        <h1 className='mt-3 text-sm text-gray-700'>Dont have an account? Register <Link href='/register' className='text-green-700'>here</Link></h1>
    </div>
    
  )
}


export default page