import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'

// Geometry definitions for reuse
const rockGeometry = new THREE.DodecahedronGeometry(0.4, 0);
const rockMaterial = new THREE.MeshStandardMaterial({ color: "#ff4d4d", roughness: 0.8 });

const waterMaterial = new THREE.MeshStandardMaterial({ color: "#00f2fe", emissive: "#00f2fe", emissiveIntensity: 0.5, transparent: true, opacity: 0.6 });
const bushGeometry = new THREE.SphereGeometry(0.3, 8, 8);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#2d5a27", roughness: 1 });

const ballsMaterial = new THREE.MeshStandardMaterial({ color: "#f093fb" });

const ObstaclesInstances = ({ obstacles, type }) => {
  const ref = useRef()
  const typedObstacles = useMemo(() => obstacles.filter(o => o.type === type), [obstacles, type])

  useEffect(() => {
    if (!ref.current) return
    const dummy = new THREE.Object3D()
    typedObstacles.forEach((obs, i) => {
      dummy.position.set(obs.x, type === 'water' ? 0.05 : 0.4, obs.y)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [typedObstacles, type])

  if (typedObstacles.length === 0) return null

  let geometry = type === 'rock' ? rockGeometry : bushGeometry
  let material = type === 'rock' ? rockMaterial : bushMaterial

  if (type === 'water') {
    return (
      <instancedMesh ref={ref} args={[new THREE.BoxGeometry(1, 0.1, 1), waterMaterial, typedObstacles.length]} receiveShadow />
    )
  }

  return (
    <instancedMesh ref={ref} args={[geometry, material, typedObstacles.length]} castShadow />
  )
}

// Bouncy balls need individual Float components, so they are kept separate but optimized
const BouncyBall = ({ x, y }) => (
  <group position={[x, 0.3, y]}>
    <mesh castShadow>
      <sphereGeometry args={[0.2, 12, 12]} />
      <meshStandardMaterial color="#f093fb" />
    </mesh>
  </group>
)

const Obstacles = ({ obstacles }) => {
  const ballObstacles = useMemo(() => obstacles.filter(o => o.type === 'balls'), [obstacles])

  return (
    <group>
      <ObstaclesInstances obstacles={obstacles} type="rock" />
      <ObstaclesInstances obstacles={obstacles} type="bush" />
      <ObstaclesInstances obstacles={obstacles} type="water" />

      {ballObstacles.map((obs, i) => (
        <BouncyBall key={`${obs.x}-${obs.y}-${i}`} x={obs.x} y={obs.y} />
      ))}
    </group>
  )
}

export default React.memo(Obstacles)
