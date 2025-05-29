'use client'

import { useEffect, useState } from 'react'

export default function CursorGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMouseInside, setIsMouseInside] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsMouseInside(true)
    }

    const handleMouseLeave = () => {
      setIsMouseInside(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        opacity: isMouseInside ? 1 : 0,
        background: `
          radial-gradient(
            600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(59, 130, 246, 0.15) 0%,
            rgba(147, 51, 234, 0.1) 25%,
            rgba(236, 72, 153, 0.05) 50%,
            transparent 100%
          )
        `,
      }}
    />
  )
}