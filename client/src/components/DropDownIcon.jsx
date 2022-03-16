import React, {useState, useEffect} from "react"
import IconControl from "./IconControl"
import pencil from '../images/icon_pencil.png'
import eraser from '../images/icon_eraser.png'
import brush from '../images/icon_brush.png'
import { TOOLS, ACTIONS } from "./DrawingCanvas"

export default function DropDownIcon({ drawing_controller }){

  const [dropDown, setDropDown] = useState(false)
  const [selectedID, setSelectedID] = useState(drawing_controller(ACTIONS.GET_TOOL_TYPE,null))

  function selectIcon(id){
    setDropDown(!dropDown)
    setSelectedID(id)
    drawing_controller(ACTIONS.SET_TOOL_TYPE, id)
  }

  useEffect(()=>{
    var tempArray = []
    for(let i=0; i<masterArray.length; i++){
      if(masterArray[i].props.id === selectedID){
        tempArray.push(masterArray[i])
        break
      }
    }
    if(dropDown === true){
      for(let i=0; i<masterArray.length; i++){
        if(masterArray[i].props.id != selectedID){
          tempArray.push(masterArray[i])
        }
      }
    }
    setSelectionArray(tempArray)
  },[dropDown])

  const masterArray = [
    <IconControl key={0} id={TOOLS.PEN} selectIcon={selectIcon} icon={pencil}/>,
    <IconControl key={1} id={TOOLS.ERASER} selectIcon={selectIcon} icon={eraser}/>,
    <IconControl key={2} id={TOOLS.BRUSH} selectIcon={selectIcon} icon={brush}/>
  ]

  const [selectionArray, setSelectionArray] = useState(masterArray[drawing_controller(ACTIONS.GET_TOOL_TYPE,null)])

  return(
    <>
    <div className="icon-dropdown-placeHolder"/>
    <div className="icon-dropdown">
      {selectionArray}
    </div>
    </>
  )

}