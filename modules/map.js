import mapData from './mapData.js';

const width = 762;
const hegiht = 758;
const map = L.map('map', { crs: L.CRS.Simple });
const bounds = [[0,0], [width, hegiht]];


export function init() {
    loadMapImage();
    loadMapData();
}

function loadMapImage() {
    L.imageOverlay('./assets/map.png', bounds).addTo(map);
    map.fitBounds(bounds);
}

function loadMapData() {
    mapData.forEach(value => {
        const area = L.polygon(value.area, {color: value.colorArea}).addTo(map);
        L.polyline(value.edges, {color: 'red'}).addTo(map);

        value.nodes.forEach(node => {
            L.marker(node).addTo(map);
        })
    })
}
