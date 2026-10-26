/**
 * Solar Explorer - Interactive JavaScript Logic (Second Evaluation)
 */

document.addEventListener('DOMContentLoaded', () => {
    initPlanetSearch();
    initAgeCalculator();
    initWeightCalculator();
    initMissionSearch();
    initRandomFact();
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
    ageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateAges();
        }
    });
}

/* ========================================================
   Feature C — Planetary Weight Calculator on fun-space.html
   ======================================================== */
function initWeightCalculator() {
    const weightInput = document.getElementById('user-weight-input');
    const calcBtn = document.getElementById('calc-weight-btn');
    const errorMsg = document.getElementById('weight-calc-msg');
    const displayTarget = document.getElementById('weight-display-target');
    const specRows = document.querySelectorAll('#weight-specs-list .spec-row');

    if (!calcBtn || !weightInput) return;

    // Note: These figures represent the equivalent scale reading in kilograms under
    // different celestial surface gravities, not a change in intrinsic mass.
    const earthGravity = 9.81; // m/s²
    const celestialGravities = {
        'moon': 1.62,
        'mercury': 3.7,
        'venus': 8.87,
        'mars': 3.72,
        'jupiter': 24.79,
        'saturn': 10.44,
        'uranus': 8.87,
        'neptune': 11.15
    };

    function calculateWeights() {
        const earthWeight = parseFloat(weightInput.value);

        if (isNaN(earthWeight) || earthWeight <= 0 || earthWeight > 500) {
            if (errorMsg) errorMsg.textContent = 'Please enter a valid Earth weight between 1 and 500 kg.';
            return;
        }

        if (errorMsg) errorMsg.textContent = '';
        if (displayTarget) displayTarget.textContent = earthWeight;

        specRows.forEach((row) => {
            const labelText = row.querySelector('.spec-label')?.textContent.toLowerCase() || '';
            const valSpan = row.querySelector('.spec-val');
            if (!valSpan) return;

            for (const [world, gravity] of Object.entries(celestialGravities)) {
                if (labelText.includes(world)) {
                    const weightOnWorld = earthWeight * (gravity / earthGravity);
                    valSpan.textContent = weightOnWorld.toFixed(1) + ' kg';
                    break;
                }
            }
        });
    }

    calcBtn.addEventListener('click', calculateWeights);
    weightInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateWeights();
        }
    });
}

/* ========================================================
   Feature D — Mission Search on missions.html
   ======================================================== */
function initMissionSearch() {
    const searchInput = document.getElementById('mission-search-input');
    const emptyMsg = document.getElementById('mission-search-empty');
    const missionItems = document.querySelectorAll('.timeline-item');

    if (!searchInput || missionItems.length === 0) return;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        let matches = 0;

        missionItems.forEach((item) => {
            const itemText = item.textContent.toLowerCase();
            if (query === '' || itemText.includes(query)) {
                item.style.display = '';
                matches++;
            } else {
                item.style.display = 'none';
            }
        });

        if (emptyMsg) {
            emptyMsg.style.display = matches === 0 ? 'block' : 'none';
        }
    });
}

/* ========================================================
   Feature E — Random Space Fact on extreme.html
   ======================================================== */
function initRandomFact() {
    const factText = document.getElementById('extreme-fact-text');
    const nextBtn = document.getElementById('next-fact-btn');

    if (!factText || !nextBtn) return;

    const facts = [
        "A teaspoon of neutron star material would weigh approximately 6 billion tons on Earth due to hyper-dense atomic packing.",
        "At the event horizon of a black hole, gravitational time dilation is so intense that an outside observer would see you freeze in time forever.",
        "A single supernova detonation can briefly outshine all of the hundreds of billions of stars in its host galaxy combined.",
        "The supermassive black hole at the center of our Milky Way, Sagittarius A*, has the mass of roughly 4.3 million Suns.",
        "Quasars are powered by supermassive black holes feeding on gas at relativistic velocities, generating luminosity up to 1,000 times brighter than our entire galaxy.",
        "If the Sun were replaced by a black hole of equal mass, Earth would not get sucked in—it would continue orbiting normally in perpetual darkness.",
        "The largest known supergiant star, Stephenson 2-18, is so enormous that nearly 10 billion Suns could fit inside its volume.",
        "Some neutron stars, known as magnetars, possess magnetic fields up to 1,000 trillion times stronger than Earth's magnetic shield.",
        "Heavy elements like gold, platinum, and uranium were forged primarily during violent neutron star collisions and supernova explosions.",
        "Gamma-ray bursts release as much energy in a matter of seconds as our Sun will emit over its entire 10-billion-year lifespan.",
        "The fastest spinning known pulsar, PSR J1748-2446ad, rotates 716 times every single second—its equator moves at nearly a quarter the speed of light.",
        "Black holes slowly radiate away their mass and can evaporate over incomprehensible eons through quantum effects known as Hawking radiation."
    ];

    let lastIndex = -1;

    nextBtn.addEventListener('click', () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * facts.length);
        } while (newIndex === lastIndex && facts.length > 1);

        lastIndex = newIndex;
        factText.textContent = facts[newIndex];
    });
}
