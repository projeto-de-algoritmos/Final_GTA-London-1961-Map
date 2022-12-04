import mapData from './mapData.js';
import * as graph from './graph.js';

const width = 762;
const height = 758;
const map = L.map('map', { crs: L.CRS.Simple });
const bounds = [[0, 0], [width, height]];

let from;
let to;
const fromLine = L.polyline([], {color: 'red'}).addTo(map);
const toLine = L.polyline([], { color: 'red' }).addTo(map);
let route;

const defaultIcon = L.icon({
    iconUrl: 'assets/black-marker.png',
    iconSize: [34, 34],
    iconAnchor: [18, 35],
});

const selectedIcon = L.icon({
    ...defaultIcon,
    iconUrl: 'assets/red-marker.png',
});


export function init() {
    listenBtnEvents();
    loadMapImage();
    loadMapData();
}

function loadMapImage() {
    L.imageOverlay('./assets/map.png', bounds).addTo(map);
    map.fitBounds(bounds);
}

function loadMapData() {
    const { area, points } = mapData
    L.polygon(area, {color: 'yellow', fill: true}).addTo(map);

    points.forEach(point => {
        point.marker = L.marker(point.pos).setIcon(defaultIcon).addTo(map);
        addMarkerEvents(point);
    })
}

function addMarkerEvents(point) {
    point.marker.addEventListener('mouseover', (el) => openPopup(el, point))
    .addEventListener('mouseout', () => map.closePopup())
    .addEventListener('click', () => handleSelection(point));
}

function openPopup({ latlng }, { name }) {
    L.popup(latlng, {
        content: name,
        offset: L.point(0, -30)
    }).openOn(map);
}

function handleSelection(point, reset = false) {
    fromLine.setLatLngs([]);
    toLine.setLatLngs([]);
    if(route) map.removeLayer(route);

    if (!from && !to) {
        from = point;
    } else if (from && !to && from === point) {
        return window.alert("Selecione dois lugares diferentes!");
    } else if (from && !to) {
        to = point;
    } else if (from && to) {
        from = point;
        to = null;
    }
    setTexts();
    setMarkersIcon();
}

function listenBtnEvents() {
    document.getElementById('route').addEventListener('click', () => calculateRoute());
    document.getElementById('reset').addEventListener('click', () => resetRoute());
}

function calculateRoute() {
    if (!from || !to) {
        return window.alert("Selecione uma origem e um destino!")
    }

    const closestNodeFrom = graph.getClosestNode(from.pos).toString();
    const closestNodeTo = graph.getClosestNode(to.pos).toString();
    const res = graph.findShortestPath(closestNodeFrom, closestNodeTo)
    const nodes = res.path.map(item => {
        const pos = item.split(',');
        return [Number(pos[0]), Number(pos[1])]
    })
    drawEdges(nodes);
}

function drawEdges(nodes) {
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        edges.push([nodes[i], nodes[i+1]])
    }
    route = L.polyline(edges, { color: 'red' }).addTo(map);
    fromLine.setLatLngs([from.pos, graph.getClosestNode(from.pos)]);
    toLine.setLatLngs([to.pos, graph.getClosestNode(to.pos)]);
}

function resetRoute() {
    to = null;
    from = null;
    handleSelection(null, true);
}

function setTexts() {
    const fromEl = document.getElementById("from");
    const toEl = document.getElementById("to");
    fromEl.innerText = from?.name || '-';
    toEl.innerText = to?.name || '-';
}

function setMarkersIcon() {
    const { points } = mapData;
    points.forEach(point => {
        const icon = point === to || point === from ? selectedIcon : defaultIcon
        point.marker.setIcon(icon);
    });
}
