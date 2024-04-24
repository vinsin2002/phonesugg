/* eslint-disable @next/next/no-img-element */
"use client"
import React from 'react'
import {  Montserrat } from 'next/font/google'
const inter = Montserrat({ subsets: ['latin'] })
function Phonecard(props) {
  return (
    <div className={`flex justify-center items-center ${inter.className}`}>
    <div className=' rounded-lg shadow-lg p-5 md:p-10 m-2 w-full  flex  md:flex-row space-x-10 md:space-x-20'>
        <img className='w-1/2 md:w-auto mb-5 md:mb-0' src={props.image} alt={props.pname}/>
        <div className='w-1/2 text-xs md:text-lg md:text-left'>
            <h1 className=' md:text-2xl font-semibold mb-2'>{props.pname}</h1>
            <h1 className='text-lg'>&#8377;{props.price}</h1>
            <div className=''>
            {props.RAM &&<h1>Ram : {props.RAM} GB</h1>}
                {props.ROM &&<h1>Rom : {props.ROM} GB</h1>}
            </div>
            {props.DisplaySize &&<h1>Display Size : {props.DisplaySize}&#34; {props.DisplayType}</h1>}
            {props.Battery &&<h1>Battery : {props.Battery} mAh</h1>}
            {props.ProcessorName &&<h1>Processor : {props.ProcessorName}</h1>}
            <div className=''>
{props.FrontCamera && <h1>FrontCamera : {props.FrontCamera} MP</h1>}
                {props.RearCamera &&<h1>RearCamera : {props.RearCamera} MP</h1>}
            </div>
            <p className='text-xs text-gray-400 text-right mt-6 italic'>Details credit: flipkart.com</p>
        </div>
    </div>
</div>

  )
}

export default Phonecard