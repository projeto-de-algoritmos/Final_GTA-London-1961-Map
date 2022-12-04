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