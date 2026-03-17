import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const CandyGoal = ({ position }) => {
  const candyRef = useRef()

  useFrame((state) => {
    if (candyRef.current) {
      candyRef.current.rotation.y += 0.02
    }
  })

  return (
    <group position={position}>
      {/* Goal Node Glow on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>

      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <group ref={candyRef} position={[0, 0.8, 0]}>
          {/* Stick */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.8]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.3} />
          </mesh>

          {/* Candy Head - Swirly Lollipop Pattern Effect */}
          <mesh position={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial
              color="#ff0ea1"
              emissive="#ff0080"
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.5}
            />
          </mesh>

          {/* Decorative Ring (Wrapper/Swirl indicator) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.31, 0.02, 16, 100]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>

          <Sparkles count={20} scale={1.2} size={2} speed={0.4} color="#ff00ff" />
        </group>
      </Float>

      <pointLight position={[0, 1.5, 0]} intensity={2} color="#ff00ff" distance={4} />
    </group>
  )
}

export default CandyGoal
