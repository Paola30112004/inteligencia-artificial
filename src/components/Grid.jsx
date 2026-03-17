import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

// Grass blade geometry
const bladeGeometry = new THREE.PlaneGeometry(0.08, 0.25);
bladeGeometry.translate(0, 0.125, 0); // Origin at bottom

const Grid = ({ size = 15, obstacles = [], onTileClick }) => {
  const meshRef = useRef()
  const grassRef = useRef()

  const tileGeometry = useMemo(() => new THREE.PlaneGeometry(0.95, 0.95), [])

  useEffect(() => {
    if (!meshRef.current || !grassRef.current) return

    const dummyTile = new THREE.Object3D()
    const dummyBlade = new THREE.Object3D()
    
    // Setup tiles
    let count = 0
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        dummyTile.position.set(x, 0.01, y)
        dummyTile.rotation.set(-Math.PI / 2, 0, 0)
        dummyTile.updateMatrix()
        meshRef.current.setMatrixAt(count, dummyTile.matrix)

        const color = (x + y) % 2 === 0 ? new THREE.Color("#4a9c40") : new THREE.Color("#3d8b34")
        meshRef.current.setColorAt(count, color)
        count++
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.instanceColor.needsUpdate = true

    // Setup grass blades (Optimized)
    const bladesPerTile = 15
    const totalBlades = size * size * bladesPerTile
    for (let i = 0; i < totalBlades; i++) {
        const tileX = Math.floor(i / (size * bladesPerTile))
        const tileZ = Math.floor((i / bladesPerTile) % size)
        
        const hasObstacle = obstacles.some(obs => obs.x === tileX && obs.y === tileZ)
        
        if (hasObstacle) {
          dummyBlade.scale.setScalar(0)
        } else {
          const offsetX = (Math.random() - 0.5)
          const offsetZ = (Math.random() - 0.5)
          dummyBlade.position.set(tileX + offsetX, 0.02, tileZ + offsetZ)
          dummyBlade.rotation.set(0, Math.random() * Math.PI, (Math.random() - 0.5) * 0.3)
          dummyBlade.scale.setScalar(0.4 + Math.random() * 0.8)
        }
        
        dummyBlade.updateMatrix()
        grassRef.current.setMatrixAt(i, dummyBlade.matrix)
        
        const g = 0.5 + Math.random() * 0.5
        grassRef.current.setColorAt(i, new THREE.Color(0.2, g, 0.1))
    }
    grassRef.current.instanceMatrix.needsUpdate = true
    grassRef.current.instanceColor.needsUpdate = true

  }, [size, obstacles])

  return (
    <group>
      {/* Base Floor (Dirt/Deep Grass) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[size / 2 - 0.5, -0.01, size / 2 - 0.5]} receiveShadow>
        <planeGeometry args={[size + 2, size + 2]} />
        <meshStandardMaterial color="#1a3d1a" />
      </mesh>

      {/* Unified Raycast Plane */}
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

      {/* Instanced Tiles (Visual background for grid) */}
      <instancedMesh
        ref={meshRef}
        args={[tileGeometry, null, size * size]}
      >
        <meshStandardMaterial transparent opacity={0.4} metalness={0.1} roughness={1} />
      </instancedMesh>

      {/* 3D Grass Blades (High detail, low cost) */}
      <instancedMesh
        ref={grassRef}
        args={[bladeGeometry, null, size * size * 15]}
        castShadow
      >
        <meshStandardMaterial side={THREE.DoubleSide} />
      </instancedMesh>

      {/* Subtle Grid Helper */}
      <gridHelper
        args={[size, size, "#000000", "#000000"]}
        position={[size / 2 - 0.5, 0.06, size / 2 - 0.5]}
        transparent
        opacity={0.1}
      />

      {/* Coordinates */}
      {size <= 10 && Array.from({ length: size }).map((_, x) => (
        Array.from({ length: size }).map((_, y) => (
          <Text
            key={`${x}-${y}`}
            position={[x, 0.05, y + 0.35]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.08}
            color="white"
            fillOpacity={0.4}
          >
            {`${x},${y}`}
          </Text>
        ))
      ))}
    </group>
  )
}

export default React.memo(Grid)
