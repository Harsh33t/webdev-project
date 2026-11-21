/**
 * public/js/radarUtils.js
 * High-precision coordinate projection utility for orbital canvas mapping.
 */
function projectEquirectangular(lat, lon, width, height) {
    return {
        x: ((lon + 180) / 360) * width,
        y: ((90 - lat) / 180) * height
    };
}
if (typeof module !== 'undefined') module.exports = { projectEquirectangular };
