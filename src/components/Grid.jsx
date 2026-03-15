import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

const Grid = ({ size = 15, onTileClick }) => {
  const meshRef = useRef()
  const linesRef = useRef()
  
  const tileGeometry = useMemo(() => new THREE.PlaneGeometry(0.95, 0.95), [])
  const lineGeometry = useMemo(() => new THREE.PlaneGeometry(1, 0.05), [])

  useEffect(() => {
    if (!meshRef.current) return

    const dummy = new THREE.Object3D()
    let count = 0
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        dummy.position.set(x, 0.01, y)
        dummy.rotation.set(-Math.PI / 2, 0, 0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(count, dummy.matrix)
        
        // Color variation for checkered pattern
        const color = (x + y) % 2 === 0 ? new THREE.Color("#1e2a4a") : new THREE.Color("#1a1a3a")
        meshRef.current.setColorAt(count, color)
        count++
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.instanceColor.needsUpdate = true
  }, [size])

  return (
    <group>
      {/* Base Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[size / 2 - 0.5, -0.01, size / 2 - 0.5]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#0c0c1e" />
      </mesh>

      {/* Unified Raycast Plane (More robust for clicks) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[size / 2 - 0.5, 0.05, size / 2 - 0.5]} 
        visible={false}
        onPointerDown={(e) => {
          e.stopPropagation()
          const x = Math.round(e.point.x)
          const z = Math.round(e.point.z)
          if (x >= 0 && x < size && z >= 0 && z < size) {
            onTileClick(x, z)
          }
        }}
      >
        <planeGeometry args={[size, size]} />
      </mesh>

      {/* Instanced Tiles (Visuals only) */}
      <instancedMesh 
        ref={meshRef} 
        args={[tileGeometry, null, size * size]} 
      >
        <meshStandardMaterial transparent opacity={0.6} metalness={0.2} roughness={0.8} />
      </instancedMesh>

      {/* Static Grid Lines */}
      <gridHelper 
        args={[size, size, "#4facfe", "#2a2a4a"]} 
        position={[size / 2 - 0.5, 0.02, size / 2 - 0.5]} 
      />

      {/* Coordinates (Highly optimized: only for small grids) */}
      {size <= 12 && Array.from({ length: size }).map((_, x) => (
        Array.from({ length: size }).map((_, y) => (
          <Text
            key={`${x}-${y}`}
            position={[x, 0.02, y + 0.35]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.1}
            color="white"
            fillOpacity={0.1}
          >
            {`${x},${y}`}
          </Text>
        ))
      ))}
    </group>
  )
}

export default React.memo(Grid)
