import React, {useState} from "react"
import { ACTIONS } from "./DrawingCanvas"

export default function PenSize({drawing_controller}){

  const [open, setOpen] = useState(false)
  const [size, setSize] = useState(drawing_controller(ACTIONS.GET_TOOL_SIZE,null))
  const minSize = 1
  const maxSize = 10

  function setSlider(){
    let temp = document.getElementById("pen-size").value
    setSize(temp)
    drawing_controller(ACTIONS.SET_TOOL_SIZE,temp)
  }

  return(
    <>
      <div className="drawing-control-icon" onClick={()=>setOpen(!open)}>
        {size}
        {
          open &&
          <div className="pen-slider">
            <input type="range" orient="vertical" min={minSize} max={maxSize} value={size} onChange={()=>setSlider()} id="pen-size"/>
          </div>
        }
      </div>
    </>
  )

}