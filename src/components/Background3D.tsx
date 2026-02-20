'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * Premium 3D Particle Constellation Background
 * 
 * A high-performance canvas-based particle animation that creates
 * a floating constellation/network effect with depth simulation.
 * 
 * Colors are matched to the portfolio's modern tech palette:
 * - Blue: #3b82f6
 * - Purple: #8b5cf6
 * - Cyan: #06b6d4
 * 
 * To adjust colors, modify the PARTICLE_COLORS array below.
 * To adjust density, modify PARTICLE_COUNT / PARTICLE_COUNT_MOBILE.
 * To adjust connection distance, modify CONNECTION_DISTANCE.
 */

// ─── Configuration ──────────────────────────────────────────────
const PARTICLE_COLORS = [
  { r: 59, g: 130, b: 246 },   // blue    #3b82f6
  { r: 139, g: 92, b: 246 },   // purple  #8b5cf6
  { r: 6, g: 182, b: 212 },    // cyan    #06b6d4
  { r: 148, g: 163, b: 184 },  // muted   #94a3b8
]

const PARTICLE_COUNT = 80        // Desktop particle count
const PARTICLE_COUNT_MOBILE = 35 // Mobile particle count
const CONNECTION_DISTANCE = 160  // Max distance for connecting lines
const MOUSE_RADIUS = 200         // Mouse interaction radius
const BASE_SPEED = 0.35          // Base particle movement speed
const DEPTH_LAYERS = 3           // Number of depth layers for parallax

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: { r: number; g: number; b: number }
  alpha: number
  depth: number       // 0 = far, 1 = mid, 2 = close
  baseAlpha: number
  pulseOffset: number // For subtle pulsing
}

export function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const timeRef = useRef(0)
  const isReducedMotionRef = useRef(false)

  const createParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768
    const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const depth = i % DEPTH_LAYERS
      const depthFactor = (depth + 1) / DEPTH_LAYERS

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * BASE_SPEED * depthFactor,
        vy: (Math.random() - 0.5) * BASE_SPEED * depthFactor,
        radius: (Math.random() * 1.5 + 0.5) * depthFactor + 0.5,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: 0,
        depth,
        baseAlpha: (0.25 + Math.random() * 0.35) * depthFactor,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }

    return particles
  }, [])

  const animate = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = dimensionsRef.current
    const particles = particlesRef.current
    const mouse = mouseRef.current
    const time = timeRef.current

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Update time
    timeRef.current += 0.005

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Gentle pulsing alpha
      const pulse = Math.sin(time * 2 + p.pulseOffset) * 0.08
      p.alpha = p.baseAlpha + pulse

      // Fade in on load
      if (p.alpha < p.baseAlpha) {
        p.alpha = Math.min(p.alpha + 0.002, p.baseAlpha)
      }

      // Mouse interaction — gentle attraction for close particles
      if (p.depth === DEPTH_LAYERS - 1) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.008
          p.vx += dx / dist * force
          p.vy += dy / dist * force
        }
      }

      // Apply velocity with gentle damping
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.999
      p.vy *= 0.999

      // Wrap around edges with soft transition
      if (p.x < -20) p.x = width + 20
      if (p.x > width + 20) p.x = -20
      if (p.y < -20) p.y = height + 20
      if (p.y > height + 20) p.y = -20

      // Draw particle with glow
      const { r, g, b } = p.color
      const glowRadius = p.radius * 3

      // Outer glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius)
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.6})`)
      gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.2})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.beginPath()
      ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Core particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 1.5})`
      ctx.fill()
    }

    // Draw connections between nearby particles (only same or adjacent depth)
    ctx.lineWidth = 0.5
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]
        const b = particles[j]

        // Only connect particles in same or adjacent depth layers
        if (Math.abs(a.depth - b.depth) > 1) continue

        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        const maxDist = CONNECTION_DISTANCE * ((a.depth + b.depth + 2) / (DEPTH_LAYERS * 2))

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.18 * ((a.depth + b.depth + 2) / (DEPTH_LAYERS * 2))

          // Blend colors of connected particles
          const r = Math.round((a.color.r + b.color.r) / 2)
          const g = Math.round((a.color.g + b.color.g) / 2)
          const bVal = Math.round((a.color.b + b.color.b) / 2)

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(${r}, ${g}, ${bVal}, ${opacity})`
          ctx.stroke()
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(() => animate(ctx))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    isReducedMotionRef.current = motionQuery.matches

    if (isReducedMotionRef.current) {
      // Don't animate if user prefers reduced motion — just show static particles
      return
    }

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for perf
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      dimensionsRef.current = { width, height }
      particlesRef.current = createParticles(width, height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    // Touch support
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    // Initialize
    handleResize()

    // Start animation
    animationFrameRef.current = requestAnimationFrame(() => animate(ctx))

    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    // Handle reduced motion changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches
      if (e.matches) {
        cancelAnimationFrame(animationFrameRef.current)
      } else {
        animationFrameRef.current = requestAnimationFrame(() => animate(ctx))
      }
    }
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [animate, createParticles])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}
