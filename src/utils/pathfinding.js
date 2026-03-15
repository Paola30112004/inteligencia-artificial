export class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = `${x},${y}`;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.parent = null;
    this.isObstacle = false;
  }
}

export function aStar(start, goal, grid) {
  // IMPORTANT: Reset grid nodes to clear data from previous runs
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const node = grid[x][y];
      node.g = 0;
      node.h = 0;
      node.f = 0;
      node.parent = null;
    }
  }

  const openList = [start];
  const openSet = new Set([start.id]);
  const closedSet = new Set();

  while (openList.length > 0) {
    // Select node with lowest f-score
    let lowInd = 0;
    for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < openList[lowInd].f) {
            lowInd = i;
        }
    }
    
    const currentNode = openList[lowInd];

    if (currentNode.x === goal.x && currentNode.y === goal.y) {
      let curr = currentNode;
      const path = [];
      while (curr.parent) {
        path.push(curr);
        curr = curr.parent;
      }
      return path.reverse();
    }

    openList.splice(lowInd, 1);
    openSet.delete(currentNode.id);
    closedSet.add(currentNode.id);

    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor.id) || neighbor.isObstacle) {
        continue;
      }

      const gScore = currentNode.g + 1;
      let gScoreIsBest = false;

      if (!openSet.has(neighbor.id)) {
        gScoreIsBest = true;
        neighbor.h = Math.abs(neighbor.x - goal.x) + Math.abs(neighbor.y - goal.y);
        openList.push(neighbor);
        openSet.add(neighbor.id);
      } else if (gScore < neighbor.g) {
        gScoreIsBest = true;
      }

      if (gScoreIsBest) {
        neighbor.parent = currentNode;
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
      }
    }
  }

  return [];
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { x, y } = node;
  const size = grid.length;

  if (x > 0) neighbors.push(grid[x - 1][y]);
  if (x < size - 1) neighbors.push(grid[x + 1][y]);
  if (y > 0) neighbors.push(grid[x][y - 1]);
  if (y < grid[0].length - 1) neighbors.push(grid[x][y + 1]);

  return neighbors;
}
