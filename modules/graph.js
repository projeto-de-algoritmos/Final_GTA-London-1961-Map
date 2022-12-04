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


export function getClosestNode(pos, district) {
    const [ x, y ] = pos;
    let minDistance = Infinity;
    let minSource;

    mapData.forEach(value => {
        if(value.district === district) {
            value.nodes.forEach(node => {
                const [targetX, targetY] = node;
                const distance = Math.abs(targetX-x) + Math.abs(targetY-y);
                if(distance < minDistance) {
                    minDistance = distance;
                    minSource = node;
                }
            });
        }
    });

    return minSource;
}

function loadGraphData() {
    mapData.forEach(value => {
        value.nodes.forEach(node => {
            addNode(node);
        })
    });

    mapData.forEach(value => {
        value.edges.forEach(edge => {
            addEdge(edge);
        })
    });
}