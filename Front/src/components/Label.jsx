import React from 'react'

export default function Label({color, text }) {
  return (
    <Form.Label style={{ color }}>{text}</Form.Label>
  )
}