import mapData from './mapData.js';

const width = 762;
const height = 758;
const map = L.map('map', { crs: L.CRS.Simple });
const bounds = [[0, 0], [width, height]];
let from;
let to;
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
    mapData.forEach(value => {
        const area = L.polygon(value.area, {color: value.colorArea}).addTo(map);
        L.polyline(value.edges, {color: 'red'}).addTo(map);

        value.nodes.forEach(node => {
            node.marker = L.marker(node.pos).setIcon(defaultIcon).addTo(map);
            addMarkerEvents(node);
        })
    })
}

function addMarkerEvents(node) {
    node.marker.addEventListener('mouseover', (el) => {
        L.popup(
            el.latlng,
            {
                content: node.name,
                offset: L.point(0, -30)
            }
        ).openOn(map);
    })
    .addEventListener('mouseout', () => {
        map.closePopup();
    })
    .addEventListener('click', (el) => {
        if (!from && !to) {
            from = node;
        } else if (from && !to && from === node) {
            return window.alert("Selecione dois lugares diferentes!");
        } else if (from && !to) {
            to = node;
        } else if (from && to) {
            from = node;
            to = null;
        }
        setTexts();
        setMarkersIcon();
    });
}

function listenBtnEvents() {
    document.getElementById('route').addEventListener('click', () => calculateRoute());
    document.getElementById('reset').addEventListener('click', () => resetRoute());
}

function calculateRoute() {
    if (!from || !to) {
        return window.alert("Selecione uma origem e um destino!")
    }
    // TODO mostrar edges
}

function resetRoute() {
    to = null;
    from = null;
    setTexts();
    setMarkersIcon();
}

function setTexts() {
    const fromEl = document.getElementById("from");
    const toEl = document.getElementById("to");
    fromEl.innerText = from?.name || '-';
    toEl.innerText = to?.name || '-';
}

function setMarkersIcon() {
    mapData.forEach(value => {
        value.nodes.forEach(node => {
            const icon = node.marker === to?.marker || node.marker === from?.marker ? selectedIcon : defaultIcon
            node.marker.setIcon(icon);
        });
    })
}
