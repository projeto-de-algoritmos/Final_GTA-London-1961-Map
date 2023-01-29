import mapData from './mapData.js';

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

export function findShortestPath(startNode, endNode) {
    const graph = adjacentList;
    let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);

    let parents = { endNode: null };
    for (let child in graph[startNode]) {
        parents[child] = startNode;
    }

    let visited = [];
    let node = shortestDistanceNode(distances, visited);

    while (node) {
        let distance = distances[node];
        let children = graph[node];

        for (let child in children) {
            if (String(child) === String(startNode)) {
                continue;
            } else {
                let newdistance = distance + children[child];
                if (!distances[child] || distances[child] > newdistance) {
                    distances[child] = newdistance;
                    parents[child] = node;
                }
            }
        }
        visited.push(node);
        node = shortestDistanceNode(distances, visited);
    }

    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
        shortestPath.push(parent);
        parent = parents[parent];
    }
    shortestPath.reverse();

    let results = {
        distance: distances[endNode],
        path: shortestPath,
    };
    return results;
};

function shortestDistanceNode(distances, visited) {
    let shortest = null;

	for (let node in distances) {
		let currentIsShortest = shortest === null || distances[node] < distances[shortest];
		if (currentIsShortest && !visited.includes(node)) shortest = node;
	}

	return shortest;
};
