import React from 'react'
import { Bar } from 'react-chartjs-2'
function Barchart({props}) {
  return (
    <Bar data={props}/>
  )
}

export default Barchart