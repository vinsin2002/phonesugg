"use client"
import React, { useEffect } from 'react'
import { useFormState } from 'react-dom'
import Button from './Button'
import { register } from '@/lib/actions';
import { useRouter } from 'next/navigation';
function RegisterForm() {
    const [state, formAction] = useFormState(register,undefined);
    
    const router = useRouter();

    useEffect(() => {
      state?.success && router.push("/login");
    }, [state?.success, router]);
    

  return (
    <form action={formAction} className=' mt-20 h-1/3 flex flex-col justify-evenly  rounded-md m-5 mb-0'>
    <h1 className='text-center text-3xl font-semibold mb-5'>Let&apos;s Create an account</h1>
        <input type='text' name='username' placeholder='username' className='outline-none border rounded-md p-2 m-2 focus:border-green-800' />
        <input type='password' name='password' placeholder='password' className='outline-none border rounded-md p-2 m-2 focus:border-green-800'/>
        <input type='password' name='confirmpassword' placeholder='confirm password' className='outline-none border rounded-md p-2 m-2 focus:border-green-800'/>
        <Button name="Register"/>
        {state?.error && <h1 className='border border-red-300 rounded-md p-2  text-red-800 text-center'>❌ {state?.error}</h1>}
        <p className='text-center '>or</p>
    </form>
  )
}

export default RegisterForm