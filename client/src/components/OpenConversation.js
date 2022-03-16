import React, { useState, useCallback, useRef } from 'react'
import { useConversations } from '../contexts/ConversationsProvider';
import DrawingCanvas from './DrawingCanvas';
import DrawingControls from './DrawingControls';
import Picture from './Picture';

export default function OpenConversation() {
  const [text, setText] = useState('')
  // const [picture, setPicture] = useState('')
  const [drawing, setDrawing] = useState('')
  const [drawWindow, setDrawWindow] = useState(false)
  const [post, setPost] = useState(false);
  var img_data = []

  const drawingRef = useRef()

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])
  const { sendMessage, selectedConversation } = useConversations()


  function submitImage(image_data) {
    //setDrawWindow(false)
    img_data = image_data
  }

  function handleSubmit(e) {
    e.preventDefault()

    if(drawing){
      console.log(drawing);
    }

    if(!text){
      console.log('no text')
      return
    }

    drawingRef.current.getDrawing()

    sendMessage(
      selectedConversation.recipients.map(r => r.id),
      text,
      img_data
    )
    setText('')
    setDrawing('')
    img_data = []
    setDrawWindow(false)
    toggleDrawWindow()
  }

  function toggleDrawWindow(){
    setDrawWindow(!drawWindow)
    drawingRef.current.toggleCanvas()
  }

  return (
    <div className="d-flex flex-column justify-content-between border conversation-container">
      <div className="overflow-auto border">
        <div className="d-flex flex-column align-items-start px-3">
          {selectedConversation.messages.map((message, index) => {
            const lastMessage = selectedConversation.messages.length - 1 === index
            return (
              <div
                
                key={index}
                className={`text-box-container ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
              >
                <Picture img_array={message.picture}/>
                <div className='text-box'>
                  {message.text}
                </div>
                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`} ref={lastMessage ? setRef : null}>
                  {message.fromMe ? 'You' : message.senderName}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="chat-controls">
        <div className="draw-button" onClick={()=>toggleDrawWindow()}>
        </div>
        <textarea className='text-area' value={text} onChange={e => setText(e.target.value)}></textarea>
        <input type="submit" value="Post" className='btn btn-primary'/>
        <DrawingCanvas submitImage={submitImage} ref={drawingRef} />
      </form>
      
    </div>
    
  )
}
