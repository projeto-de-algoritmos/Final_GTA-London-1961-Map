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
        L.polygon(value.area, {color: 'pink', fill: false}).addTo(map);
        L.polyline(value.edges, {color: 'red'}).addTo(map);

        value.points.forEach(point => {
            point.marker = L.marker(point.pos).setIcon(defaultIcon).addTo(map);
            addMarkerEvents(point);
        })
    })
}

function addMarkerEvents(point) {
    point.marker.addEventListener('mouseover', (el) => {
        L.popup(
            el.latlng,
            {
                content: point.name,
                offset: L.point(0, -30)
            }
        ).openOn(map);
    })
    .addEventListener('mouseout', () => {
        map.closePopup();
    })
    .addEventListener('click', () => {
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
        value.points.forEach(point => {
            const icon = point.marker === to?.marker || point.marker === from?.marker ? selectedIcon : defaultIcon
            point.marker.setIcon(icon);
        });
    })
}
