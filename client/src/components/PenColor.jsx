import React, {useState, useEffect, useRef} from "react"
import { ACTIONS } from "./DrawingCanvas"

export default function PenColor({drawing_controller}){

  const [open, setOpen] = useState(false)
  const [color, setColor] = useState(drawing_controller(ACTIONS.GET_TOOL_COLOR,null))
  const pickerRef = useRef(null)
  const width = 128
  const height = 128

  useEffect(()=>{
    if(open){
      let ctxPicker = pickerRef.current.getContext("2d");
      let gradient = ctxPicker.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "rgb(255, 0, 0)");
      gradient.addColorStop(0.15, "rgb(255, 0, 255)");
      gradient.addColorStop(0.33, "rgb(0, 0, 255)");
      gradient.addColorStop(0.49, "rgb(0, 255, 255)");
      gradient.addColorStop(0.67, "rgb(0, 255, 0)");
      gradient.addColorStop(0.84, "rgb(255, 255, 0)");
      gradient.addColorStop(1, "rgb(255, 0, 0)");
      ctxPicker.fillStyle = gradient;
      ctxPicker.fillRect(0, 0, width, height);

      let values = ctxPicker.createLinearGradient(0, 0, 0, height);
      values.addColorStop(0, "rgba(255, 255, 255, 1)");
      values.addColorStop(0.5, "rgba(255, 255, 255, 0)");
      values.addColorStop(0.51, "rgba(0, 0, 0, 0)");
      values.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctxPicker.fillStyle = values;
      ctxPicker.fillRect(0, 0, width, height);
    }
  },[open])

  function pick_color(e){
    let ctxPicker = pickerRef.current.getContext("2d");
    let imageData = ctxPicker.getImageData(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 1, 1);
    let temp_color = `rgb(${imageData.data[0]},${imageData.data[1]},${imageData.data[2]})`
    setColor(temp_color)
    drawing_controller(ACTIONS.SET_TOOL_COLOR,temp_color)
  }

  return(
    <>
      <div className="drawing-control-icon" style={{'backgroundColor': color}} onClick={()=>setOpen(!open)}>
        {
          open &&
          <canvas 
            className="color-selector"
            ref={pickerRef} 
            width="128px"
            height="128px"
            onMouseDown={pick_color}
            onMouseMove={pick_color}
          />
        }
      </div>
    </>
  )

}