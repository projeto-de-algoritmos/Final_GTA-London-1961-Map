import mapData from './mapData.js';

const adjacentList = new Map();


export function init() {
    loadGraphData();
}

export function addNode(node) {
    adjacentList.set(node.toString(), []);
}

export function addEdge([source, target]) {
    adjacentList.get(source.toString()).push(target);
    adjacentList.get(target.toString()).push(source);
}

export function getAdjacentNodes(node) {
    return adjacentList.get(node.toString());
}


export function getClosestNode([ x, y ]) {
    let minDistance = Infinity;
    let minSource;

    mapData.forEach(({ nodes }) => {
        nodes.forEach(node => {
            const [targetX, targetY] = node;
            const distance = Math.abs(targetX - x) + Math.abs(targetY - y);
            if(distance < minDistance) {
                minDistance = distance;
                minSource = node;
            }
        });
    });

    return minSource;
}

function loadGraphData() {
    mapData.forEach(({ nodes, edges }) => {
        nodes.forEach(node => addNode(node))
        edges.forEach(edge => addEdge(edge))
    });
}

export function findShortestPath(startNode, endNode) {
    const graph = formatList();
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


function formatList() {
    const res = {};
    for (let [key, values] of adjacentList) {
        res[key] = {};
        values.forEach(value => {
            res[key][value] = calculateDistance(key, value.toString());
        });
    }
    return res
};

function calculateDistance(initPos, targetPos) {
    const [x1, y1] = initPos.split(',');
    const [x2, y2] = targetPos.split(',');
    const res = Math.abs(x1 - x2 - y1 - y2);
    return res;
}