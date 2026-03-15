import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

const CandyGoal = ({ position }) => {
  const pointsRef = useRef()

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.01
    }
  })

  const candyPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 50; i++) {
      pos.push(
        (Math.random() - 0.5) * 0.6,
        Math.random() * 0.4,
        (Math.random() - 0.5) * 0.6
      )
    }
    return new Float32Array(pos)
  }, [])

  return (
    <group position={position}>
      {/* Goal Node Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Candies as a cloud of points with different colors */}
        <Points positions={candyPositions} stride={3} ref={pointsRef}>
          <PointMaterial
            transparent
            vertexColors
            size={0.1}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
        
        {/* Central candy pile */}
        <mesh position={[0, 0.2, 0]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
        </mesh>
      </Float>

      <pointLight position={[0, 1, 0]} intensity={1} color="#ffff00" />
    </group>
  )
}

export default CandyGoal
