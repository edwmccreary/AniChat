import React from "react"

export default function IconControl({id, selectIcon, icon}){

  return(
    <div className="drawing-control-icon" onClick={()=>selectIcon(id)}>
      <img src={icon} alt="" />
    </div>
  )

}