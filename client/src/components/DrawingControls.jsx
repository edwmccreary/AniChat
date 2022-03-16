import React, {useState, useEffect} from "react"
import DropDownIcon from "./DropDownIcon"
import icon_back from '../images/icon_back.png'
import icon_forward from '../images/icon_forward.png'
import icon_plus from '../images/icon_plus.png'
import icon_play from '../images/icon_play.png'
import icon_stop from '../images/icon_stop.png'
import PenSize from "./PenSize"
import PenColor from "./PenColor"

export default function DrawingControls({openWindow, drawing_controller}){

  const [playing, setPlaying] = useState(false)
  const [frame, setFrame] = useState(0)
  const [last_frame, set_last_frame] = useState(0)

  function toggle_animation(){
    setPlaying(!playing)
  }

  useEffect(()=>{
    let interval = null
    if(playing){
      interval = setInterval(() => {
        let temp_frame = frame + 1
        if(temp_frame > last_frame){
          temp_frame = 0
        }
        setFrame(temp_frame)
      }, 500);
    } else if (!playing && frame !==0) {
      clearInterval(interval)
    }
    return ()=> clearInterval(interval)
  },[playing, frame])

  function add_frame(){
    if(frame == last_frame){
      set_last_frame(last_frame + 1)
      setFrame(frame + 1)
    }
    else{
      if(frame < last_frame){
        setFrame(frame + 1)
      }
    }
  }

  function back_frame(){
    if(frame > 0){
      setFrame(frame - 1)
    }
  }

  return(
    <>
    {
      openWindow &&
      <div className="drawing-window-container">
        <div className="drawing-window-controls">
          <div className='drawing-control-group'>
            <div className='drawing-control-icon' onClick={()=> back_frame()}><img src={icon_back} alt="back icon" /></div>
            <div className='drawing-control-icon' onClick={()=> add_frame()}><img src={frame==last_frame ? icon_plus : icon_forward} alt="plus icon" /></div>
            <div className='drawing-control-icon' onClick={()=> toggle_animation()}><img src={playing ? icon_stop : icon_play} alt="play icon" /></div>
          </div>
          <div>
            {frame}/{last_frame}
          </div>
          <div className='d-flex'>
            <DropDownIcon />
            <PenSize drawing_controller={drawing_controller}/>
            <PenColor />
          </div>
        </div>
      </div>
    }
    </>
  )

}