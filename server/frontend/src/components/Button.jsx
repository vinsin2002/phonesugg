import React from 'react'

function Button(props) {
  return (
    <button type='submit' className=' bg-teal-600 w-auto text-white p-2 m-2 rounded-md '>{props.name}</button>
  )
}

export default Button