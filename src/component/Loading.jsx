import React from 'react'
import loading from '../assets/loading.gif'

function Loading() {
  return (
    <>
    <center>
        <div>
            <img src={loading} alt="loading..." />
        </div>
    </center>
    </>
  )
}

export default Loading