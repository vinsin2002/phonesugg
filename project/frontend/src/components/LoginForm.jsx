"use client"

import React from 'react'
import Button from './Button'
import { login } from '@/lib/actions'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
function LoginForm() {
    const [state, formAction] = useFormState(login,undefined);
    
    const router = useRouter();


  return (
    <form action={formAction} className=' mt-20 h-1/3 flex flex-col justify-evenly  rounded-md m-5 mb-0'>
        <h1 className='text-center text-3xl font-semibold mb-5'>Sign in to your Account</h1>
            <input name='username' type='text' placeholder='username' className='outline-none border rounded-md p-2 m-2 focus:border-green-700' />
            <input name='password' type='password' placeholder='password' className='outline-none border rounded-md p-2 m-2 focus:border-green-700'/>
            <Button name="Login"/>
            {state?.error && <h1 className='border border-red-300 rounded-md p-2  text-red-800 text-center'>❌ {state?.error}</h1>}
            <p className='text-center '>or</p>
    </form>
  )
}

export default LoginForm