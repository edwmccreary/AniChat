import React, { useState, useCallback } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider';
import DrawingWindow from './DrawingWindow';

export default function OpenConversation() {
  const [text, setText] = useState('')
  const [drawing, setDrawing] = useState('')
  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])
  const { sendMessage, selectedConversation } = useConversations()

  function handleSubmit(e) {
    e.preventDefault()

    if(drawing){
      console.log(drawing);
    }

    if(!text){
      console.log('no text')
      return
    }

    sendMessage(
      selectedConversation.recipients.map(r => r.id),
      text
    )
    setText('')
    setDrawing('')
  }

  return (
    <div className="d-flex flex-column justify-content-between border">
      <div className="overflow-auto border">
        <div className="d-flex flex-column align-items-start px-3">
          {selectedConversation.messages.map((message, index) => {
            const lastMessage = selectedConversation.messages.length - 1 === index
            return (
              <div
                ref={lastMessage ? setRef : null}
                key={index}
                
                className={` ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
              >
                <div
                  className={`flex-wrap rounded px-2 py-1 ${message.fromMe ? 'bg-primary text-white' : 'border'}`}
                  
                  >
                  {message.text}
                </div>
                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                  {message.fromMe ? 'You' : message.senderName}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {/* <DrawingWindow/> */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              as="textarea"
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ height: '75px', resize: 'none' }}
            />
            <InputGroup.Append>
              <Button type="submit" onClick={()=>{setDrawing('default.png')}}>Post</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
    
  )
}
