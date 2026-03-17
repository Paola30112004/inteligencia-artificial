import React from 'react'

const Character = ({ position }) => {
  return (
    <group position={[position[0], 0.1, position[2]]}>
      {/* Legs */}
      <mesh position={[-0.1, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
        <meshStandardMaterial color="#af0707" />
      </mesh>
      <mesh position={[0.1, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
        <meshStandardMaterial color="#af0707" />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.1, 0.02, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.1, 0.02, 0.05]} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Body / Shirt */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.35, 4, 8]} />
        <meshStandardMaterial color="#af0707" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.22, 0.6, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
        <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
        <meshStandardMaterial color="#ffccaa" />
      </mesh>
      <mesh position={[0.22, 0.6, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
        <capsuleGeometry args={[0.05, 0.25, 4, 8]} />
        <meshStandardMaterial color="#ffccaa" />
      </mesh>

      {/* Head */}
      <group position={[0, 0.85, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.06, 0.05, 0.15]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.06, 0.05, 0.15]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>

        {/* Smile (Simplified) */}
        <mesh position={[0, -0.05, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.01, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>

        {/* Blue Cap */}
        <group position={[0, 0.1, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.19, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#007bff" />
          </mesh>
          <mesh position={[0, 0, 0.12]} castShadow>
            <boxGeometry args={[0.2, 0.02, 0.2]} />
            <meshStandardMaterial color="#007bff" />
          </mesh>
        </group>
      </group>

      {/* Backpack */}
      <mesh position={[0, 0.55, -0.15]} castShadow>
        <boxGeometry args={[0.2, 0.3, 0.12]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Start Node Glow */}
      <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.6} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={1} color="#00ff00" distance={3} />
    </group>
  )
}

export default React.memo(Character)
