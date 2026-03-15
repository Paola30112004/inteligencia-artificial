# Camino más corto - Visualizador de Pathfinding 3D

Este es un visualizador interactivo de algoritmos de búsqueda de caminos (A*) construido con un estilo "Park/Day" vibrante y optimizado para alto rendimiento.

## 🚀 Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clonar o descargar el proyecto**:
   Asegúrate de tener todos los archivos en una carpeta.

2. **Instalar dependencias**:
   Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   Copia la URL que aparece en la terminal (usualmente `http://localhost:5173`) y pégala en tu navegador.

---

## 🎮 Cómo interactuar

- **Mover el Niño**: Haz clic en el botón "Niño" y luego haz clic en cualquier parte de la cuadrícula de pasto.
- **Mover los Caramelos**: Haz clic en el botón "Caramelos" y luego haz clic en la cuadrícula.
- **Calcular camino**: Presiona el botón rosa "**Encontrar camino más corto**".
- **Reiniciar**: Presiona "**Reiniciar**" para borrar el camino actual.
- **Tamaño del mapa**: Usa el buscador (*slider*) para cambiar el tamaño de la cuadrícula en tiempo real (de 5x5 a 30x30).

---

## 🛠️ Tecnologías utilizadas

- **React**: Biblioteca principal para la interfaz de usuario.
- **Three.js / React Three Fiber**: Motor 3D para renderizar el mundo y los personajes.
- **React Three Drei**: Utilidades avanzadas para Three.js (textos, controles, efectos).
- **Vite**: Herramienta de construcción ultrarrápida.
- **Algoritmo A***: Implementación personalizada y optimizada para encontrar el camino más corto de forma eficiente.

---

## 🧠 Algoritmo de Grafos Utilizado: A* (A-Estrella)

El corazón de este visualizador es el algoritmo **A***, uno de los más eficientes para la búsqueda de caminos en entornos de cuadrícula.

- **Heurística Inteligente**: A diferencia de Dijkstra, A* utiliza una función heurística (en este caso, la **Distancia de Manhattan**) para estimar la distancia restante al objetivo. Esto le permite priorizar los caminos que se dirigen hacia los caramelos, reduciendo drásticamente el número de nodos explorados.
- **Fórmula**: `f(n) = g(n) + h(n)`
  - `g(n)`: Costo real del camino desde el inicio.
  - `h(n)`: Estimación del costo hasta el final.
- **Eficiencia**: Implementado utilizando **Sets** en JavaScript para garantizar búsquedas en tiempo constante $O(1)$ de nodos ya visitados, lo que permite cálculos instantáneos en tiempo real.

---

## 📂 Estructura Detallada del Proyecto

El proyecto está organizado de forma modular para separar la lógica de negocio (cálculos) de la representación visual (3D).

### 📁 `src/components/` (Interfaz 3D)
- **`PlaygroundScene.jsx`**: El cerebro visual. Configura el escenario, las luces, el sistema de cámaras y coordina cómo interactúan los modelos entre sí.
- **`Grid.jsx`**: Renderiza el campo de juego de pasto. Incluye un sistema de detección de clics invisible que garantiza que puedas mover los objetos con precisión.
- **`Character.jsx`**: Define el diseño del niño con su gorra azul y mochila. Se actualiza automáticamente cuando el algoritmo encuentra una nueva posición inicial.
- **`CandyGoal.jsx`**: Renderiza el montón de caramelos mágicos con animaciones de flotación y efectos de luz.
- **`Obstacle.jsx`**: Sistema de rocas, arbustos y agua. Utiliza **InstancedMesh** para renderizar cientos de objetos a la vez sin que el juego se ponga lento.
- **`NeonPath.jsx`**: Crea la línea brillante de color naranja que muestra el camino. Incluye micro-animaciones de flechas para indicar la dirección hacia la meta.

### 📁 `src/utils/` (Inteligencia / Cálculos)
- **`pathfinding.js`**: **El motor de cálculos**. Contiene la lógica pura del algoritmo A*. Aquí se define cómo se conectan los nodos, cómo se evitan los obstáculos y cómo se calcula matemáticamente la ruta más corta bajo la superficie 3D.

### 📁 Raíz del Código
- **`App.jsx`**: El punto de partida de la aplicación. Gestiona la interfaz de usuario (botones, sliders) y conecta la lógica de React con el mundo de Three.js.
- **`index.css`**: Define el estilo visual "Day Mode", los colores de los botones neon y el fondo de nubes pixeladas que cubre toda la pantalla.
- **`main.jsx`**: Inicia React y monta todo el sistema en el navegador.

---

---

## ⚡ Optimizaciones clave

- **Instanced Rendering**: Las rocas, arbustos y el suelo se renderizan en grupos para minimizar las llamadas de dibujo (draw calls), permitiendo fluidez incluso en mapas grandes.
- **A* con Sets**: El algoritmo utiliza estructuras de datos de conjunto para búsquedas instantáneas, evitando latencia en el cálculo.
- **Unified Raycast**: Se utiliza un plano invisible para detectar clics, garantizando que el usuario siempre pueda mover los objetos sin que los obstáculos bloqueen la interacción.
