import React, { useRef, forwardRef, useState, useEffect } from 'react'
import { useImperativeHandle } from 'react';
import DropDownIcon from "./DropDownIcon"
import icon_back from '../images/icon_back.png'
import icon_forward from '../images/icon_forward.png'
import icon_plus from '../images/icon_plus.png'
import icon_play from '../images/icon_play.png'
import icon_stop from '../images/icon_stop.png'
import PenSize from "./PenSize"
import PenColor from "./PenColor"

//these numbers corespond with masterArray index in DropDownIcon
export const TOOLS = {
  PEN: 0,
  ERASER: 1,
  BRUSH: 2
}

export const ACTIONS = {
  SET_TOOL_SIZE: 'setToolSize',
  GET_TOOL_SIZE: 'getToolSize',
  SET_TOOL_COLOR: 'setToolColor',
  GET_TOOL_COLOR: 'getToolColor',
  SET_TOOL_TYPE: 'setToolType',
  GET_TOOL_TYPE: 'getToolType',
  SET_PLAYING: 'setPlaying',
  ADD_FRAME: 'addFrame',
  DELETE_FRAME: 'deleteFrame',
  GET_FRAME: 'getFrame',
  UP_FRAME: 'upFrame',
  DOWN_FRAME: 'downFrame',
  SAVE_FRAME: 'saveFrame',
  LOAD_FRAME: 'loadFrame'
}

const DrawingCanvas = forwardRef((props, ref) => {

  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const paintRef = useRef(null)
  const paintCtxRef = useRef(null)
  const prevFrameRef = useRef(null)
  const flattenFrameRef = useRef(null)
  const [pencilData, setPencilData] = useState("")
  const [brushData, setBrushData] = useState("")
  const [toolOn,setToolOn] = useState(false)
  const [toolType, setToolType] = useState(TOOLS.PEN)
  const [lineWidth, setLineWidth] = useState(1)
  const [lineColor, setLineColor] = useState("black")
  
  const [lineOpacity, setLineOpacity] = useState(1.0)
  const [openWindow, setOpenWindow] = useState(false)

  const [playing, setPlaying] = useState(false)
  const [frame, setFrame] = useState(0)
  var cframe = useRef(0)
  var lframe = useRef(0)
  var frame_array = useRef([])
  var frame_array_flattened = useRef([])
  const [lastFrame, setLastFrame] = useState(0)

  const [tool, setTool] = useState({
    type: TOOLS.PEN,
    width: lineWidth,
    color: lineColor
  })

  function drawing_controller(action, value){
    switch(action){
      case ACTIONS.SET_TOOL_TYPE:
        return setToolType(value)
      case ACTIONS.GET_TOOL_TYPE:
        return toolType
      case ACTIONS.SET_TOOL_SIZE:
        return setLineWidth(value)
      case ACTIONS.GET_TOOL_SIZE:
        return lineWidth
      case ACTIONS.SET_TOOL_COLOR:
        return setLineColor(value)
      case ACTIONS.GET_TOOL_COLOR:
        return lineColor;
      case ACTIONS.ADD_FRAME:
        return add_frame()
      case ACTIONS.DELETE_FRAME:
        return delete_frame()
      case ACTIONS.GET_FRAME:
        return frame
      case ACTIONS.UP_FRAME:
        return up_frame()
      case ACTIONS.DOWN_FRAME:
        return down_frame()
      case ACTIONS.SAVE_FRAME:
        return save_current_frame()
      case ACTIONS.LOAD_FRAME:
        return load_current_frame()
    }
  }

  useEffect(() => {
    if(openWindow){
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = lineOpacity;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctxRef.current = ctx;

      const paint_canvas = paintRef.current;
      const paint_ctx = paint_canvas.getContext("2d");
      paint_ctx.lineCap = "round";
      paint_ctx.lineJoin = "round";
      paint_ctx.globalAlpha = lineOpacity;
      paint_ctx.strokeStyle = lineColor;
      paint_ctx.lineWidth = lineWidth;
      paintCtxRef.current = paint_ctx;
      
    }
  }, [lineColor, lineOpacity, lineWidth,openWindow]);

  useEffect(()=>{
    if(openWindow){
      load_current_frame()
    }
    else{
      setPlaying(false)
    }
  },[openWindow])

  function createCanvas(width, height) {
    let c = document.createElement('canvas');
    c.setAttribute('width', width);
    c.setAttribute('height', height);
    return c;
  }

  function save_current_frame(){
    console.log("saving frame data")
    let pencil_canvas = canvasRef.current;
    let brush_canvas = paintRef.current;
    let canvas_data = pencil_canvas.toDataURL("image/png")
    let brush_data = brush_canvas.toDataURL("image/png")
    let current_frame = {
      line: canvas_data,
      brush: brush_data
    }
    frame_array.current[cframe.current] = current_frame
    //save_flat_frame()
  }

  function load_current_frame(){
    let pencil_canvas = canvasRef.current.getContext("2d");
    let brush_canvas = paintRef.current.getContext("2d");
    //console.log(frame_array.current[0])
    //console.log(frame_array.current)
    //console.log(cframe.current)
    if(typeof frame_array.current[cframe.current] === 'object'){
      // console.log("canvas loaded")
      let pencil_image = new Image();
      pencil_image.src = frame_array.current[cframe.current].line
      pencil_image.onload = function(){
        pencil_canvas.drawImage(this, 0,0);
      }

      let brush_image = new Image();
      brush_image.src = frame_array.current[cframe.current].brush
      brush_image.onload = function(){
        brush_canvas.drawImage(this, 0,0);
      }
    }
    else{
      // console.log("canvas saved")
      //save_current_frame()
    }
  }

  function show_prev_frame(){
    if(cframe == 0){
      return
    }
    let prev_frame_canvas = prevFrameRef.current.getContext("2d");
    prev_frame_canvas.clearRect(0, 0, prevFrameRef.current.width, prevFrameRef.current.height);
    let pframe = cframe.current -1
    if(typeof frame_array.current[pframe] === 'object'){
      prev_frame_canvas.globalAlpha = 0.2;

      let brush_image = new Image();
      brush_image.src = frame_array.current[pframe].brush
      brush_image.onload = function(){
        prev_frame_canvas.drawImage(this, 0,0);
      }

      let pencil_image = new Image();
      pencil_image.src = frame_array.current[pframe].line
      pencil_image.onload = function(){
        prev_frame_canvas.drawImage(this, 0,0);
      }
    }
  }

  function clear_prev_frame(){
    let prev_frame_canvas = prevFrameRef.current.getContext("2d");
    prev_frame_canvas.clearRect(0, 0, prevFrameRef.current.width, prevFrameRef.current.height);
  }

  //write both layers to a single canvas then save the image_url, store in array to be used for the final submission
  function save_flat_frame(){
    // let pencil_canvas = canvasRef.current.getContext("2d");
    // let brush_canvas = paintRef.current.getContext("2d");
    
    let flat_canvas = flattenFrameRef.current.getContext("2d");

    let brush_image = new Image();
    brush_image.src = frame_array.current[cframe.current].brush
    brush_image.onload = function(){
      flat_canvas.drawImage(this, 0,0);
    }

    let pencil_image = new Image();
    pencil_image.src = frame_array.current[cframe.current].line
    pencil_image.onload = function(){
      flat_canvas.drawImage(this, 0,0);
    }
    let frame_data = flattenFrameRef.current.toDataURL("image/png")
    frame_array_flattened.current[cframe.current] = frame_data
    flat_canvas.clearRect(0, 0, flattenFrameRef.current.width, flattenFrameRef.current.height);
    
  }

  const start_tool = (e) => {
    setToolOn(true);
    switch(toolType){
      case TOOLS.PEN:
        return startDrawing(e)
      case TOOLS.ERASER:
        return erase_tool(e)
      case TOOLS.BRUSH:
        return startPainting(e)
    }
  }

  const end_tool = (e) => {
    setToolOn(false);
    switch(toolType){
      case TOOLS.PEN:
        return endDrawing(e)
      case TOOLS.ERASER:
        return null
      case TOOLS.BRUSH:
        return endPainting(e)
    }
  }

  const update_tool = (e) => {
    switch(toolType){
      case TOOLS.PEN:
        return draw(e)
      case TOOLS.ERASER:
        return erase_tool(e)
      case TOOLS.BRUSH:
        return paint(e)
    }
  }

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );
    
  };

  const endDrawing = () => {
    ctxRef.current.closePath();
    
  };

  const draw = (e) => {
    if (!toolOn) {
      return;
    }
    ctxRef.current.lineTo(
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );
      
    ctxRef.current.stroke();
  };

  const erase_tool = (e) => {
    if (!toolOn) {
      return;
    }
    let eraser_head = ctxRef.current.createImageData(lineWidth, lineWidth);
    ctxRef.current.putImageData(eraser_head, e.nativeEvent.offsetX-(lineWidth/2), e.nativeEvent.offsetY-(lineWidth/2));
  }

  const startPainting = (e) => {
    paintCtxRef.current.beginPath();
    paintCtxRef.current.moveTo(
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );
  }

  const endPainting = () => {
    paintCtxRef.current.closePath();
  }

  const paint = (e) => {
    if (!toolOn) {
      return;
    }
    paintCtxRef.current.lineTo(
      e.nativeEvent.offsetX, 
      e.nativeEvent.offsetY
    );
      
    paintCtxRef.current.stroke();
  }

  function add_frame(){
    
    save_current_frame()
    clear_canvas()
    
    lframe.current = lframe.current + 1
    cframe.current = cframe.current + 1
    setLastFrame(lframe.current)
    setFrame(lframe.current)
    //save_current_frame()
    show_prev_frame()
    //console.log("added frame "+cframe.current)
  }
  
  function goto_frame(_frame){
    save_current_frame()
    clear_canvas()
    cframe.current = _frame
    setFrame(_frame)
    if(!playing){
      show_prev_frame()
    }
    load_current_frame()
  }

  function clear_canvas(){
    let pencil_canvas = canvasRef.current.getContext("2d");
    let brush_canvas = paintRef.current.getContext("2d");
    pencil_canvas.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    brush_canvas.clearRect(0, 0, paintRef.current.width, paintRef.current.height);
  }

  function delete_frame(){

  }

  function up_frame(){
    if(frame < lastFrame){
      goto_frame(cframe.current+1)
    }
    else{
      goto_frame(0)
    }
  }

  function down_frame(){
    if(frame > 0){
      goto_frame(cframe.current-1)
    }
    else{
      goto_frame(lframe.current)
    }
  }

  function delete_frame(frame_number){

  }

  function toggle_animation(){
    setPlaying(!playing)
    clear_prev_frame()
  }

  useEffect(()=>{
    let interval = null
    if(playing){
      interval = setInterval(() => {
        up_frame()
      }, 500);
    } else if (!playing && frame !==0) {
      clearInterval(interval)
    }
    return ()=> clearInterval(interval)
  },[playing, frame])

  useImperativeHandle(ref, ()=> ({
    getDrawing() {
      submitDrawing()
    },
    toggleCanvas(){
      if(openWindow){
        save_current_frame()
      }
      setOpenWindow(!openWindow)
    },
  }))

  function clear_frame_array(){
    frame_array.current = []
    cframe = 0
    lframe = 0
    setFrame(0)
    setLastFrame(0)
  }

  const submitDrawing = () => {
    save_current_frame()
    props.submitImage(frame_array.current)
    clear_frame_array()
  }

  return(
    <>
      {
      openWindow &&
      <div className="drawing-window-container">
        <div className="drawing-window-controls">
          <div className='drawing-control-group'>
            <div className='drawing-control-icon' onClick={()=> down_frame()}><img src={icon_back} alt="back icon" /></div>
            <div className='drawing-control-icon' onClick={()=> frame==lastFrame ? add_frame() : up_frame()}><img src={frame==lastFrame ? icon_plus : icon_forward} alt="plus icon" /></div>
            <div className='drawing-control-icon' onClick={()=> toggle_animation()}><img src={playing ? icon_stop : icon_play} alt="play icon" /></div>
          </div>
          <div>
            {frame}/{lastFrame}
          </div>
          <div className='d-flex'>
            <DropDownIcon drawing_controller={drawing_controller}/>
            <PenSize drawing_controller={drawing_controller}/>
            <PenColor drawing_controller={drawing_controller}/>
          </div>
        </div>
      </div>
      }
      <div className={openWindow ? 'draw-window' : 'draw-window-closed'}>
        <canvas 
        ref={flattenFrameRef} 
        width={openWindow ? "256px" : "0px"}
        height={openWindow ? "256px" : "0px"}
        />      
      </div>
      <div className={openWindow ? 'draw-window' : 'draw-window-closed'}>
        <canvas 
        ref={prevFrameRef} 
        width={openWindow ? "256px" : "0px"}
        height={openWindow ? "256px" : "0px"}
        />      
      </div>
      <div className={openWindow ? 'draw-window' : 'draw-window-closed'}>
        <canvas 
        ref={paintRef}
        width={openWindow ? "256px" : "0px"}
        height={openWindow ? "256px" : "0px"}
        onMouseDown={start_tool}
        onMouseUp={end_tool}
        onMouseMove={update_tool}
        />      
      </div>
      <div className={openWindow ? 'draw-window' : 'draw-window-closed'}>
        <canvas 
        ref={canvasRef} 
        width={openWindow ? "256px" : "0px"}
        height={openWindow ? "256px" : "0px"}
        onMouseDown={start_tool}
        onMouseUp={end_tool}
        onMouseMove={update_tool}
        />      
      </div>
      
    </>
    
  )
})

export default DrawingCanvas