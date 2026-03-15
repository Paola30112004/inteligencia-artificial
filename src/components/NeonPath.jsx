import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NeonPath = ({ path, startNode }) => {
  const lineRef = useRef()
  const arrowsRef = useRef([])

  const points = useMemo(() => {
    const pts = [new THREE.Vector3(startNode.x, 0.1, startNode.y)]
    path.forEach(node => {
      pts.push(new THREE.Vector3(node.x, 0.1, node.y))
    })
    return pts
  }, [path, startNode])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.dashOffset -= 0.01
    }
  })

  return (
    <group>
      {/* The main neon line */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
        <meshStandardMaterial
          color="#ff5500"
          emissive="#c69100ff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Small arrowheads along the path */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Arrow key={i} curve={curve} offset={i / 10} />
      ))}
    </group>
  )
}

const Arrow = ({ curve, offset }) => {
  const ref = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const t = (offset + time * 0.1) % 1
    const pos = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    ref.current.position.copy(pos)
    ref.current.lookAt(pos.clone().add(tangent))
  })

  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.1, 0.2, 8]} rotation={[0, 0, -Math.PI / 2]} />
      <meshBasicMaterial color="#ffa200" />
    </mesh>
  )
}

export default NeonPath
