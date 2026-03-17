import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'

// Flower Component (Dynamic color)
const Flower = ({ x, y, color }) => {
  return (
    <group position={[x, 0.1, y]} scale={[1.3, 1.3, 1.3]}>
      {/* Stem */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.25]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      {/* Center */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#5c3c10" />
      </mesh>
      {/* Petals */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 5) * 0.15,
            0.3,
            Math.sin((i * Math.PI * 2) / 5) * 0.15
          ]}
          castShadow
        >
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}

// Tree Component
const Tree = ({ x, y }) => {
  return (
    <group position={[x, 0, y]} scale={[1.8, 1.8, 1.8]}>
      {/* Trunk */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.5]} />
        <meshStandardMaterial color="#4d2911" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.35, 0.8, 8]} />
        <meshStandardMaterial color="#1b4d1b" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.25, 0.6, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </group>
  )
}

const WaterInstances = ({ obstacles }) => {
  const ref = useRef()
  const waterObstacles = useMemo(() => obstacles.filter(o => o.type === 'water'), [obstacles])

  useEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    waterObstacles.forEach((obs, i) => {
      dummy.position.set(obs.x, 0.05, obs.y)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [waterObstacles])

  if (waterObstacles.length === 0) return null

  const waterMaterial = new THREE.MeshStandardMaterial({
    color: "#11678b",
    emissive: "#00f2fe",
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.6
  });

  return (
    <instancedMesh ref={ref} args={[new THREE.BoxGeometry(1, 0.1, 1), waterMaterial, waterObstacles.length]} receiveShadow />
  )
}

const Obstacles = ({ obstacles }) => {
  const yellowFlowers = useMemo(() => obstacles.filter(o => o.type === 'rock'), [obstacles])
  const pinkFlowers = useMemo(() => obstacles.filter(o => o.type === 'balls'), [obstacles])
  const trees = useMemo(() => obstacles.filter(o => o.type === 'bush'), [obstacles])

  return (
    <group>
      <WaterInstances obstacles={obstacles} />

      {yellowFlowers.map((obs, i) => (
        <Flower key={`yellow-${i}`} x={obs.x} y={obs.y} color="#ffeb3b" />
      ))}

      {pinkFlowers.map((obs, i) => (
        <Flower key={`pink-${i}`} x={obs.x} y={obs.y} color="#f093fb" />
      ))}

      {trees.map((obs, i) => (
        <Tree key={`tree-${i}`} x={obs.x} y={obs.y} />
      ))}
    </group>
  )
}

export default React.memo(Obstacles)
