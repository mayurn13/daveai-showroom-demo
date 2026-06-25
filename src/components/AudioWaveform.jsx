import React, { useRef, useEffect } from 'react'

export default function AudioWaveform() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let phase = 0

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      
      ctx.clearRect(0, 0, w, h)

      // Configure three distinct organic waves
      const waves = [
        { amplitude: 14, frequency: 0.012, speed: 0.03, color: 'rgba(0, 102, 204, 0.45)' },
        { amplitude: 8, frequency: 0.024, speed: -0.05, color: 'rgba(0, 102, 204, 0.25)' },
        { amplitude: 5, frequency: 0.035, speed: 0.07, color: 'rgba(0, 102, 204, 0.12)' }
      ]

      ctx.lineWidth = 1.75
      ctx.lineCap = 'round'

      waves.forEach((wave) => {
        ctx.beginPath()
        ctx.strokeStyle = wave.color
        
        for (let x = 0; x < w; x++) {
          // Sinusoidal edge decay so the wave pinches off beautifully on the left and right edges
          const edgeDecay = Math.sin((x / w) * Math.PI)
          const y = h / 2 + Math.sin(x * wave.frequency + phase * wave.speed) * wave.amplitude * edgeDecay
          
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      })

      phase += 0.8
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="w-full h-16 flex items-center justify-center bg-transparent">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
