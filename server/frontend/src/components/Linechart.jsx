import React from 'react'
import { Line } from 'react-chartjs-2'
function Linechart({props}) {
  return (
    <Line data={props}/>
  )
}

export default Linechart