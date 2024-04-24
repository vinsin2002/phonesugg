"use client"
import React, { useState, useEffect, useRef } from 'react';
import { chat } from '@/lib/actions';
import Phonecard from '@/components/Phonecard';
import {  Montserrat } from 'next/font/google'
const inter = Montserrat({ subsets: ['latin'] })

function Page() {
  const [result, setResult] = useState(null); // State to store the query result
  const [queryInput, setQueryInput] = useState(''); // State to store the query input
  const [phones, setPhones] = useState([]); // State to store the array of phones
  const [fD, setfD] = useState(null); // State to store the error message
  const inputRef = useRef(null); // Ref for the query input field
  const [rendlist, setrendlist] = useState([]);
  const [loader, setloader] = useState(false);
  const sugghandler = (value) => {
    setQueryInput(value);
};
  const handleSubmit = async (event) => {
    event.preventDefault();
    setloader(true);
    setfD(queryInput);
    try {
      const response = await chat(queryInput); // Call the chat function with form data
      setResult(response); // Update state with the result
      setQueryInput(''); 
      setPhones(response); // Update state with the array of phones
      setrendlist([...rendlist,{
        user : queryInput,
        bot : response
      }]);
      setloader(false);
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., display error message)
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSubmit(e);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the page when result is shown
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // Focus on the query input field
    inputRef.current.focus();
  }, [result]);

  return (
    <div className='w-full h-full flex justify-center items-center'>
      {result ? (
        <div className='md:w-1/2 '>
          {rendlist.map((details, ind) => (
            <div key={ind}> {/* Add a wrapping div with key attribute */}
              <h1 className={`text-center m-5 bg-gradient-to-b rounded-lg font-semibold from-slate-100 to-slate-50 p-5 ${inter.className}`}>{details.user}</h1>
              <h1 className={`text-center text-sm md:text-lg m-3 font-semibold text-teal-900 ${inter.className}`}>Sure, here are the phones that match your choices : </h1>
              {details.bot.map((phone, index) => (
                <Phonecard key={index} {...phone} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className='mt-40 md:mt-10 md:w-1/3 '>
          <h1 className="text-center text-3xl font-bold font-sans tracking-tight text-black sm:text-6xl">
            Let&apos;s Find Your Ultimate Smartphone Together!
          </h1>
          <div className='mt-36 md:mt-20 w-full flex flex-col '>
            <div className='w-full flex'>
              <div onClick={() => sugghandler("Show phones under 15k.")} value="Show phones under 15k." className='text-xs font-semibold text-gray-600 border w-1/2 rounded-lg border-gray-400 p-5 m-2 '>
                Show phones under 15k.
              </div>
              <div onClick={() => sugghandler("Looking for phones with large storage.")}  className='text-xs font-semibold text-gray-600 border w-1/2 rounded-lg border-gray-400 p-5 m-2 '>
                Looking for phones with large storage.
              </div>
            </div>
            <div className='flex'>
              <div onClick={() => sugghandler("Find phones with 5000mAh+ battery.")} className='text-xs font-semibold text-gray-600 border w-1/2 rounded-lg border-gray-400 p-5 m-2 '>
                Find phones with 5000mAh+ battery.
              </div>
              <div onClick={() => sugghandler("Recommend phones with great cameras.")} className='text-xs font-semibold text-gray-600 border w-1/2 rounded-lg border-gray-400 p-5 m-2 '>
                Recommend phones with great cameras.
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className='backdrop-filter backdrop-blur-lg bg-opacity-30 w-full md:w-1/2 fixed bottom-3 m-2'>
      <label htmlFor="chat" className="sr-only">Your message</label>
      <div className="flex items-center px-3 py-2 rounded-md bg-white backdrop-filter backdrop-blur-xl bg-opacity-30">
        <textarea
          ref={inputRef}
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={handleKeyPress} // Handle key press
          name='Query'
          id="chat"
          rows="1"
          className="block h-16 mx-4 p-2.5 w-full text-sm text-black bg-white border-gray-300 placeholder:text-gray-500 rounded-lg border outline-none focus:border-teal-700 backdrop-filter backdrop-blur-lg bg-opacity-30"
          placeholder="What kind of phone are you looking for .."
        />
        {!loader ?
         <button type="submit" className="inline-flex justify-center p-2 text-teal-700 rounded-full cursor-pointer">
          <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
          </svg>
          <span className="sr-only">Send message</span>
        </button>
        :
        <svg aria-hidden="true" className="w-10 h-10 text-white animate-spin dark:text-white fill-teal-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>}
      </div>
    </form>
    </div>
  );
}

export default Page;
