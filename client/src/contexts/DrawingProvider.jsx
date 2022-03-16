import React, { useContext, useState } from 'react'

const ToolContext = React.createContext()
const AnimationContext = React.createContext()

const TOOLS = {
  PEN: 'pen',
  ERASER: 'eraser',
  BRUSH: 'brush'
}

export function DrawingProvider({ children }){

  const [toolSize, setToolSize] = useState(1)

  const [tool, setTool] = useState({
    type: TOOLS.PEN,
    size: toolSize
  })

  const [frame, setFrame] = useState(0)
  const [frames, setFrames] = useState([])

  const [animation,setAnimation] = useState({
    playing: false,
    frame: 0,
    last_frame: 0,
    play_speed: 500
  })

  return (
    <ToolContext.Provider value={tool}>
      <AnimationContext.Provider value={animation}>
        {children}
      </AnimationContext.Provider>
    </ToolContext.Provider>
  )
}