import React, { useEffect, useRef, useState } from "react"

export default function Picture(props){

  let intervalRef = useRef()
  let frameRef = useRef(0)
  const [frame,setFrame] = useState(0)

  useEffect(()=>{
    if(props.img_array.length < 2){
      return
    }
    intervalRef.current = setInterval(advanceFrame, 140)

    return () => clearInterval(intervalRef.current)
  },[])



  const advanceFrame = () => {
    if(frameRef.current >= props.img_array.length -1){
      frameRef.current = 0
      setFrame(frameRef.current)
    }
    else{
      frameRef.current = frameRef.current + 1
      setFrame(frameRef.current)
    }
  }

  return(
    <div className="picture-container">
      <img src={props.img_array[frame].brush} alt="" />
      <img src={props.img_array[frame].line} alt="" />
    </div>
  )

}