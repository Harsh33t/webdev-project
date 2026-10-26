/**
 * Solar Explorer - Interactive JavaScript Logic (Second Evaluation)
 */

document.addEventListener('DOMContentLoaded', () => {
    initPlanetSearch();
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
