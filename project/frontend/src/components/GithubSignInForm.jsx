"use client"
import React from 'react'
import { githubSignInHandler } from '@/lib/actions'
import Image from 'next/image'
function GithubSignInForm() {
  return (
    <form action={githubSignInHandler} className="justify-evenly rounded-md ">
          <button className='bg-black w-80 text-white p-2 m-2 rounded-md flex justify-center items-center' type='submit'>Sign in with Github <Image className='ml-3 mb-1' height={20} width={20} src="/images/github-mark-white.png" alt='github'/> </button>
    </form>
  )
}

export default GithubSignInForm