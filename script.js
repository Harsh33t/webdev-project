/**
 * Solar Explorer - Interactive JavaScript Logic (Second Evaluation)
 */

document.addEventListener('DOMContentLoaded', () => {
    initPlanetSearch();
    initAgeCalculator();
    initScrollReveal();
});

/* ========================================================
   Feature A — Planet Search on index.html
   ======================================================== */
function initPlanetSearch() {
    const searchForm = document.getElementById('planet-search-form');
    const searchInput = document.getElementById('planet-search-input');
    const searchMsg = document.getElementById('planet-search-msg');

    if (!searchForm || !searchInput) return;

    const validPlanets = [
        'mercury', 'venus', 'earth', 'mars',
        'jupiter', 'saturn', 'uranus', 'neptune'
    ];

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            if (searchMsg) searchMsg.textContent = 'Please enter a planet name to search.';
            return;
        }

        if (validPlanets.includes(query)) {
            const targetSection = document.getElementById('planet-' + query);
            if (targetSection) {
                if (searchMsg) searchMsg.textContent = '';
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            if (searchMsg) {
                searchMsg.textContent = 'Planet not found. Please try Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, or Neptune.';
            }
        }
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener('input', () => {
        if (searchMsg) searchMsg.textContent = '';
    });
}

/* ========================================================
   Feature I — Subtle Scroll Reveal Animations
   ======================================================== */
function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        return;
    }

    const revealTargets = document.querySelectorAll(
        '.voyage-slide, .planet-card, .timeline-item, .sun-block, .fact-card'
    );

    if (revealTargets.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach((el) => {
        el.classList.add('reveal-init');
        observer.observe(el);
    });
}

/* ========================================================
   Feature B — Planetary Age Calculator on fun-space.html
   ======================================================== */
function initAgeCalculator() {
    const ageInput = document.getElementById('user-age-input');
    const calcBtn = document.getElementById('calc-age-btn');
    const errorMsg = document.getElementById('age-calc-msg');
    const displayTarget = document.getElementById('age-display-target');
    const specRows = document.querySelectorAll('#age-specs-list .spec-row');

    if (!calcBtn || !ageInput) return;

    // Approximate orbital periods in Earth years
    const orbitalPeriods = {
        'mercury': 0.241,
        'venus': 0.615,
        'earth': 1.0,
        'mars': 1.881,
        'jupiter': 11.86,
        'saturn': 29.46,
        'uranus': 84.02,
        'neptune': 164.8
    };

    function calculateAges() {
        const earthAge = parseFloat(ageInput.value);

        if (isNaN(earthAge) || earthAge <= 0 || earthAge > 130) {
            if (errorMsg) errorMsg.textContent = 'Please enter a valid age between 1 and 130 years.';
            return;
        }

        if (errorMsg) errorMsg.textContent = '';
        if (displayTarget) displayTarget.textContent = earthAge;

        specRows.forEach((row) => {
            const labelText = row.querySelector('.spec-label')?.textContent.toLowerCase() || '';
            const valSpan = row.querySelector('.spec-val');
            if (!valSpan) return;

            for (const [planet, period] of Object.entries(orbitalPeriods)) {
                if (labelText.includes(planet)) {
                    const planetaryAge = earthAge / period;
                    valSpan.textContent = planetaryAge.toFixed(1) + ' yrs';
                    break;
                }
            }
        });
    }

    calcBtn.addEventListener('click', calculateAges);
}
