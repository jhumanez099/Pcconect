import React from 'react'

export default function Buttons({color, fontSize, title, onClick,colorbutton}) {
  return (
    <button className="btn btn-primary button border-black" style={{ background: color, fontSize: fontSize, color:colorbutton}} onClick={onClick}>
        {title}
    </button>
  )
}