const width = 762;
const hegiht = 758;
const map = L.map('map', { crs: L.CRS.Simple });
const bounds = [[0,0], [width, hegiht]];

export function init() {
    L.imageOverlay('./assets/map.png', bounds).addTo(map);
    map.fitBounds(bounds);
}
