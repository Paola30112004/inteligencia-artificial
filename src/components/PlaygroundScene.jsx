import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Node, aStar } from '../utils/pathfinding'
import Grid from './Grid'
import Obstacle from './Obstacle'
import Character from './Character'
import NeonPath from './NeonPath'
import CandyGoal from './CandyGoal'

const PlaygroundScene = () => {
  const [gridSize, setGridSize] = useState(15)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [goalPos, setGoalPos] = useState({ x: 14, y: 14 })
  const [path, setPath] = useState([])
  const [interactionMode, setInteractionMode] = useState('goal') // 'start' or 'goal'

  // More complex and dynamic obstacles
  const obstacles = useMemo(() => {
    const obs = []
    const seed = gridSize * 123
    // Increased density factor from 2.5 to 4.5
    const obstacleCount = Math.floor(gridSize * 4.5)

    for (let i = 0; i < obstacleCount; i++) {
      // More robust pseudo-random scatter
      const x = Math.min(gridSize - 1, Math.floor((Math.abs(Math.sin(seed + i * 1.5)) * gridSize)))
      const y = Math.min(gridSize - 1, Math.floor((Math.abs(Math.cos(seed * i * 2.1)) * gridSize)))

      // Don't place obstacles on start or goal
      if ((x === startPos.x && y === startPos.y) || (x === goalPos.x && y === goalPos.y)) continue
      // Don't place on adjacent tiles to start/goal for easier start
      if (Math.abs(x - startPos.x) + Math.abs(y - startPos.y) < 2) continue
      if (Math.abs(x - goalPos.x) + Math.abs(y - goalPos.y) < 2) continue

      const types = ['rock', 'balls', 'water', 'bush']
      obs.push({ type: types[i % 4], x, y })
    }

    // Static layout feature (River/Wall)
    const mid = Math.floor(gridSize / 2)
    for (let y = 0; y < Math.floor(gridSize * 0.4); y++) {
      if (mid !== startPos.x || y !== startPos.y) {
        obs.push({ type: 'water', x: mid, y })
      }
    }

    return obs
  }, [gridSize, startPos, goalPos])

  const grid = useMemo(() => {
    const newGrid = []
    for (let x = 0; x < gridSize; x++) {
      newGrid[x] = []
      for (let y = 0; y < gridSize; y++) {
        const node = new Node(x, y)
        if (obstacles.some(o => {
          if (o.type === 'water') {
            const w = o.w || 1
            const h = o.h || 1
            return x >= o.x && x < o.x + w && y >= o.y && y < o.y + h
          }
          return o.x === x && o.y === y
        })) {
          node.isObstacle = true
        }
        newGrid[x][y] = node
      }
    }
    return newGrid
  }, [gridSize, obstacles])

  const handleFindPath = useCallback(() => {
    if (grid.length > 0) {
      const startTime = performance.now()
      const result = aStar(grid[startPos.x][startPos.y], grid[goalPos.x][goalPos.y], grid)
      const endTime = performance.now()

      window.dispatchEvent(new CustomEvent('path-metrics', { 
        detail: { 
          time: (endTime - startTime).toFixed(4),
          steps: result.length
        } 
      }))
      
      setPath(result)
    }
  }, [grid, startPos, goalPos])

  const handleReset = useCallback(() => {
    setPath([])
  }, [])

  const handleTileClick = useCallback((x, y) => {
    console.log('Grid clicked at', x, y, 'mode:', interactionMode)
    if (interactionMode === 'start') {
      setStartPos({ x, y })
    } else {
      setGoalPos({ x, y })
    }
    setPath([])
  }, [interactionMode])

  useEffect(() => {
    const onGridResize = (e) => {
      setGridSize(e.detail.size)
      setStartPos({ x: 0, y: 0 })
      setGoalPos({ x: e.detail.size - 1, y: e.detail.size - 1 })
      setPath([])
    }
    const onModeChange = (e) => setInteractionMode(e.detail.mode)

    window.addEventListener('find-path', handleFindPath)
    window.addEventListener('reset-path', handleReset)
    window.addEventListener('resize-grid', onGridResize)
    window.addEventListener('change-mode', onModeChange)

    return () => {
      window.removeEventListener('find-path', handleFindPath)
      window.removeEventListener('reset-path', handleReset)
      window.removeEventListener('resize-grid', onGridResize)
      window.removeEventListener('change-mode', onModeChange)
    }
  }, [handleFindPath, handleReset])

  return (
    <group>
      <Grid size={gridSize} obstacles={obstacles} onTileClick={handleTileClick} />

      <Obstacle obstacles={obstacles} />

      <CandyGoal position={[goalPos.x, 0, goalPos.y]} />

      <Character position={[startPos.x, 0, startPos.y]} />

      {path.length > 0 && <NeonPath path={path} startNode={startPos} />}
    </group>
  )
}

export default PlaygroundScene
