import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import PlaygroundScene from './components/PlaygroundScene'
import './index.css'

function App() {
  const [gridSize, setGridSize] = useState(15)
  const [mode, setMode] = useState('goal') // 'start' or 'goal'
  const [metrics, setMetrics] = useState(null)

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value)
    setGridSize(size)
    setMetrics(null)
    window.dispatchEvent(new CustomEvent('resize-grid', { detail: { size } }))
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    window.dispatchEvent(new CustomEvent('change-mode', { detail: { mode: newMode } }))
  }

  useEffect(() => {
    const onMetrics = (e) => setMetrics(e.detail)
    const onReset = () => setMetrics(null)
    window.addEventListener('path-metrics', onMetrics)
    window.addEventListener('reset-path', onReset)
    window.addEventListener('resize-grid', onReset)
    return () => {
      window.removeEventListener('path-metrics', onMetrics)
      window.removeEventListener('reset-path', onReset)
      window.removeEventListener('resize-grid', onReset)
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className="ui-overlay" style={{ pointerEvents: 'auto' }}>
        <h1 className="ui-title">Camino más corto</h1>
        <p className="ui-desc">Mueve el niño o el dulce haciendo clic! Ajusta el tamaño del patio de recreo a continuación.</p>

        <div className="ui-group">
          <label>Tamaño de la cuadrícula: {gridSize}x{gridSize}</label>
          <input
            type="range" min="5" max="30" value={gridSize}
            onChange={handleSizeChange}
            className="slider"
          />
        </div>

        <div className="ui-group">
          <label>Click para mover:</label>
          <div className="mode-toggle">
            <button
              className={mode === 'start' ? 'active' : ''}
              onClick={() => handleModeChange('start')}
            >Niño</button>
            <button
              className={mode === 'goal' ? 'active' : ''}
              onClick={() => handleModeChange('goal')}
            >Dulce</button>
          </div>
        </div>

        {metrics && (
          <div className="ui-metrics">
            <div className="metric-item">
              <span className="metric-label">Tiempo de búsqueda</span>
              <span className="metric-value">{metrics.time}ms</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Casillas recorridas</span>
              <span className="metric-value">{metrics.steps}</span>
            </div>
          </div>
        )}
      </div>

      <Canvas shadows alpha>


        <PerspectiveCamera
          makeDefault
          position={[gridSize * 1.5, gridSize * 1.5, gridSize * 1.5]}
          fov={30}
        />
        <OrbitControls
          enablePan={true}
          maxPolarAngle={Math.PI / 2.1}
          target={[gridSize / 2, 0, gridSize / 2]}
        />

        <ambientLight intensity={1.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />

        <Suspense fallback={null}>
          <PlaygroundScene />
          <Environment preset="city" />
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={1}
            mipmapBlur
            intensity={0.5}
            radius={0.2}
          />
        </EffectComposer>
      </Canvas>

      <div className="controls">
        <button onClick={() => window.dispatchEvent(new CustomEvent('reset-path'))}>Reiniciar</button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('find-path'))} style={{ background: '#fc00a0ff', color: '#f2e6e6ff' }}>Encontrar camino más corto</button>
      </div>
    </div>
  )
}

export default App
