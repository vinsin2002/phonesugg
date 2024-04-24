import React from 'react'
import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';
import GithubSignInForm from '@/components/GithubSignInForm';
async function page() {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        <RegisterForm/>
        <GithubSignInForm/>
        <h1 className='mt-3 text-sm text-gray-700'>Already have an account? Login <Link href='/login' className='text-green-700'>here</Link></h1>
    </div>
    
  )
}
export default page