import * as map from './modules/map.js';

window.onload = () => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    main();
}

function main() {
    map.init();
}