import React from 'react'

const Character = ({ position }) => {
  return (
    <group position={[position[0], 0.5, position[2]]}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color="#ffccaa" />
      </mesh>
      
      {/* Shirt */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.21, 0.3, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Blue Cap */}
      <group position={[0, 0.3, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#007bff" />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.25]} />
          <meshStandardMaterial color="#007bff" />
        </mesh>
      </group>

      {/* Backpack */}
      <mesh position={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.25, 0.2]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Start Node Glow */}
      <mesh position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00ff00" />
    </group>
  )
}

export default Character
