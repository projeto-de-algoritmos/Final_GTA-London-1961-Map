import mapData from './mapData.js';
import PriorityQueue from './PriorityQueue.js';

const adjacentList = {};

export function init() {
    loadGraphData();
}

function addNode(node) {
    adjacentList[node.toString()] = {};
}

function addEdge([source, target]) {
    const [sx, sy] = source;
    const [tx, ty] = target;
    const distance = Math.abs(sx - tx) + Math.abs(sy - ty);
    adjacentList[source.toString()][target.toString()] = distance;
    adjacentList[target.toString()][source.toString()] = distance;
}

export function getClosestNode([ x, y ]) {
    const { nodes } = mapData;
    let minDistance = Infinity;
    let minSource;

    nodes.forEach(node => {
        const [targetX, targetY] = node;
        const distance = Math.abs(targetX - x) + Math.abs(targetY - y);
        if(distance < minDistance) {
            minDistance = distance;
            minSource = node;
        }
    });

    return minSource;
}

function loadGraphData() {
    const { nodes, edges } = mapData
    nodes.forEach(node => addNode(node))
    edges.forEach(edge => addEdge(edge))
}

export function dijkstra(startNode, endNode) {
    const graph = adjacentList;
    const queue = new PriorityQueue();
    const visited = {};

    const shortestPaths = {};
    const shortestPathsAdd = (node, prev, distance) => {
        const [px, py] = prev.split(',');
        shortestPaths[node] = {};
        shortestPaths[node].prev = [parseInt(px), parseInt(py)];
        shortestPaths[node].distance = distance;
    }
    
    visited[startNode] = true;
    shortestPathsAdd(startNode, startNode, 0);
    queue.enqueue(startNode, 0);
    
    while (!queue.isEmpty()) {
        const currentNode = queue.dequeue().value;
        for (let neighbor in graph[currentNode]) {
            const distance = shortestPaths[currentNode].distance + graph[currentNode][neighbor];

            if (neighbor === endNode) {
                shortestPathsAdd(neighbor, currentNode, distance);
                return shortestPaths;
            };
           
            if (!shortestPaths[neighbor] || distance < shortestPaths[neighbor].distance) {
                const [nx, ny] = neighbor.split(',');
                const [cx, cy] = currentNode.split(',');
                const [px, py] = shortestPaths[currentNode].prev;
                
                if ((parseInt(cx) - px === 0 && parseInt(nx) - parseInt(cx) === 0) 
                || (parseInt(cy) - py === 0 && parseInt(ny) - parseInt(cy) === 0)) {
                    shortestPathsAdd(neighbor, currentNode, distance);
                    queue.enqueue(neighbor, distance);
                }else {
                    shortestPathsAdd(neighbor, currentNode, distance+1);
                    queue.enqueue(neighbor, distance+1);
                }
            }
        }
    }
}

export function shortestPaths2Nodes(shortestPaths, startNode, endNode) {
    const [ex, ey] = endNode.split(',');
    const [sx, sy] = startNode.split(',');
    let initialNode = [parseInt(ex), parseInt(ey)];
    const nodes = [[parseInt(ex), parseInt(ey)]];

    while(initialNode.toString() !== [parseInt(sx), parseInt(sy)].toString()) {
        nodes.push(shortestPaths[initialNode].prev);
        initialNode = shortestPaths[initialNode].prev;
    }

    return nodes;
}

function shortestDistanceNode(distances, visited) {
    let shortest = null;

	for (let node in distances) {
		let currentIsShortest = shortest === null || distances[node] < distances[shortest];
		if (currentIsShortest && !visited.includes(node)) shortest = node;
	}

	return shortest;
};
