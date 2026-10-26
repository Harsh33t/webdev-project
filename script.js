/**
 * Solar Explorer - Interactive JavaScript Logic (Second Evaluation)
 * Contains planet search, age/weight calculators, timeline search,
 * random facts, CelesTrak API catalogue retrieval, and feedback export.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPlanetSearch();
    initAgeCalculator();
    initWeightCalculator();
    initMissionSearch();
    initRandomFact();
    initSatelliteExplorer();
    initFeedbackForm();
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

    // List of available planet IDs on index.html
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

        // Update each spec row with newly computed planetary age
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

        // Weight equivalent = Earth Weight * (Gravity on world / Earth Gravity)
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

/* ========================================================
   Feature F & G — Satellite Explorer & CelesTrak API (satellites.html)
   ======================================================== */
function initSatelliteExplorer() {
    // 1. Static Satellite Educational Search
    const satSearchInput = document.getElementById('satellite-search-input');
    const satCards = document.querySelectorAll('.planets-container .planet-card');

    if (satSearchInput && satCards.length > 0) {
        satSearchInput.addEventListener('input', () => {
            const query = satSearchInput.value.trim().toLowerCase();
            satCards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                card.style.display = (query === '' || text.includes(query)) ? '' : 'none';
            });
        });
    }

    // 2. External API: CelesTrak Satellite Catalog (SATCAT) query
    const fetchBtn = document.getElementById('fetch-satcat-btn');
    const statusMsg = document.getElementById('api-status-msg');
    const filterInput = document.getElementById('api-sat-filter');
    const resultsGrid = document.getElementById('satcat-results-grid');

    if (!fetchBtn) return;

    // Primary endpoint: CelesTrak SATCAT stations query
    const celeUrl = 'https://celestrak.org/satcat/records.php?GROUP=STATIONS&FORMAT=JSON&ONORBIT=1&MAX=25';
    let loadedRecords = [];

    function renderRecords(records) {
        if (!resultsGrid) return;
        resultsGrid.innerHTML = '';

        if (records.length === 0) {
            resultsGrid.innerHTML = '<p style="color:#888;grid-column:1/-1;text-align:center;padding:20px;">No satellites matched your filter.</p>';
            return;
        }

        records.forEach((sat) => {
            const card = document.createElement('div');
            card.className = 'satcat-card';

            const name = sat.OBJECT_NAME || 'Unknown Satellite';
            const catId = sat.NORAD_CAT_ID || 'N/A';
            const type = sat.OBJECT_TYPE || 'PAYLOAD';
            const owner = sat.OWNER || 'International';
            const launchDate = sat.LAUNCH_DATE || 'Unknown';
            const period = sat.PERIOD ? `${sat.PERIOD} min` : 'N/A';
            const apogee = sat.APOGEE ? `${sat.APOGEE} km` : 'N/A';
            const perigee = sat.PERIGEE ? `${sat.PERIGEE} km` : 'N/A';

            card.innerHTML = `
                <div class="satcat-name">${escapeHtml(name)}</div>
                <div class="satcat-meta">
                    <span><strong>NORAD ID:</strong> ${escapeHtml(String(catId))}</span>
                    <span><strong>Type:</strong> ${escapeHtml(type)}</span>
                    <span><strong>Country/Owner:</strong> ${escapeHtml(owner)}</span>
                    <span><strong>Launch Date:</strong> ${escapeHtml(launchDate)}</span>
                    <span><strong>Orbital Period:</strong> ${escapeHtml(period)}</span>
                    <span><strong>Altitude:</strong> ${escapeHtml(perigee)} x ${escapeHtml(apogee)}</span>
                </div>
            `;
            resultsGrid.appendChild(card);
        });
    }

    fetchBtn.addEventListener('click', () => {
        if (statusMsg) statusMsg.textContent = 'Connecting to CelesTrak API and retrieving satellite catalog...';
        fetchBtn.disabled = true;

        fetch(celeUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                fetchBtn.disabled = false;
                if (!Array.isArray(data) || data.length === 0) {
                    if (statusMsg) statusMsg.textContent = 'No satellite records returned by CelesTrak.';
                    return;
                }

                loadedRecords = data;
                if (statusMsg) {
                    statusMsg.textContent = `Successfully retrieved ${data.length} registered orbital stations from CelesTrak.`;
                }

                if (filterInput) filterInput.style.display = 'block';
                renderRecords(loadedRecords);
            })
            .catch((err) => {
                console.warn('CelesTrak API request error:', err);
                fetchBtn.disabled = false;
                if (statusMsg) {
                    statusMsg.innerHTML = `
                        Unable to connect to CelesTrak API (${escapeHtml(err.message)}).
                        <br><button id="fetch-noaa-fallback-btn" class="btn calc-btn" style="margin-top:10px;">TEST NOAA SPACE WEATHER API ALTERNATIVE</button>
                    `;
                    const fallbackBtn = document.getElementById('fetch-noaa-fallback-btn');
                    if (fallbackBtn) {
                        fallbackBtn.addEventListener('click', fetchNoaaFallback);
                    }
                }
            });
    });

    if (filterInput) {
        filterInput.addEventListener('input', () => {
            const q = filterInput.value.trim().toLowerCase();
            const filtered = loadedRecords.filter((sat) => {
                const name = (sat.OBJECT_NAME || '').toLowerCase();
                const owner = (sat.OWNER || '').toLowerCase();
                const id = String(sat.NORAD_CAT_ID || '');
                return name.includes(q) || owner.includes(q) || id.includes(q);
            });
            renderRecords(filtered);
        });
    }

    // Fallback API if CelesTrak is blocked or network restricts it
    function fetchNoaaFallback() {
        if (statusMsg) statusMsg.textContent = 'Connecting to NOAA Space Weather API...';
        const noaaUrl = 'https://services.swpc.noaa.gov/products/noaa-scales.json';

        fetch(noaaUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (statusMsg) statusMsg.textContent = 'Successfully retrieved NOAA space weather data:';
                if (!resultsGrid) return;
                resultsGrid.innerHTML = '';

                // NOAA data contains date keys with R (Radio Blackouts), S (Solar Radiation), G (Geomagnetic Storms)
                const latestKey = Object.keys(data)[0] || '0';
                const latest = data[latestKey] || {};

                const card = document.createElement('div');
                card.className = 'satcat-card';
                card.innerHTML = `
                    <div class="satcat-name">NOAA Space Weather Status</div>
                    <div class="satcat-meta">
                        <span><strong>Timestamp:</strong> ${latest.DateStamp || ''} ${latest.TimeStamp || ''} UTC</span>
                        <span><strong>Geomagnetic (G-Scale):</strong> Scale ${latest.G?.Scale || '0'} (${latest.G?.Text || 'None'})</span>
                        <span><strong>Solar Radiation (S-Scale):</strong> Scale ${latest.S?.Scale || '0'} (${latest.S?.Text || 'None'})</span>
                        <span><strong>Radio Blackouts (R-Scale):</strong> Scale ${latest.R?.Scale || '0'} (${latest.R?.Text || 'None'})</span>
                    </div>
                `;
                resultsGrid.appendChild(card);
            })
            .catch((err) => {
                if (statusMsg) statusMsg.textContent = `NOAA API request also failed: ${err.message}`;
            });
    }
}

/* ========================================================
   Feature H — Feedback Form & Local JSON Export (feedback.html)
   ======================================================== */
function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    const nameInput = document.getElementById('fb-name');
    const emailInput = document.getElementById('fb-email');
    const topicSelect = document.getElementById('fb-topic');
    const ratingSelect = document.getElementById('fb-rating');
    const messageInput = document.getElementById('fb-message');
    const formStatus = document.getElementById('fb-status');

    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errTopic = document.getElementById('err-topic');
    const errRating = document.getElementById('err-rating');
    const errMessage = document.getElementById('err-message');

    function clearErrors() {
        if (errName) errName.textContent = '';
        if (errEmail) errEmail.textContent = '';
        if (errTopic) errTopic.textContent = '';
        if (errRating) errRating.textContent = '';
        if (errMessage) errMessage.textContent = '';
        if (formStatus) {
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';
            formStatus.textContent = '';
        }
    }

    form.addEventListener('reset', () => {
        clearErrors();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const topicVal = topicSelect ? topicSelect.value : '';
        const ratingVal = ratingSelect ? ratingSelect.value : '';
        const messageVal = messageInput ? messageInput.value.trim() : '';

        // Name validation
        if (!nameVal) {
            if (errName) errName.textContent = 'Please enter your name.';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
            if (errEmail) errEmail.textContent = 'Please enter your email address.';
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            if (errEmail) errEmail.textContent = 'Please enter a valid email format (e.g., name@example.com).';
            isValid = false;
        }

        // Topic validation
        if (!topicVal) {
            if (errTopic) errTopic.textContent = 'Please select your favourite section or topic.';
            isValid = false;
        }

        // Rating validation
        if (!ratingVal) {
            if (errRating) errRating.textContent = 'Please select a rating.';
            isValid = false;
        }

        // Message validation
        if (!messageVal) {
            if (errMessage) errMessage.textContent = 'Please provide your feedback comments.';
            isValid = false;
        }

        if (!isValid) {
            if (formStatus) {
                formStatus.textContent = 'Please correct the highlighted errors before submitting.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
            return;
        }

        // Build submission record with timestamp
        const newRecord = {
            name: nameVal,
            email: emailVal,
            topic: topicVal,
            rating: ratingVal,
            feedback: messageVal,
            submittedAt: new Date().toISOString()
        };

        // Save to localStorage (preserving previous submissions)
        const storageKey = 'solarExplorerFeedback';
        let feedbackList = [];
        let storageAvailable = true;

        try {
            const rawStored = localStorage.getItem(storageKey);
            if (rawStored) {
                const parsed = JSON.parse(rawStored);
                if (Array.isArray(parsed)) {
                    feedbackList = parsed;
                }
            }
            feedbackList.push(newRecord);
            localStorage.setItem(storageKey, JSON.stringify(feedbackList));
        } catch (storageErr) {
            console.warn('localStorage is not available or quota exceeded:', storageErr);
            storageAvailable = false;
            // Still include the current submission in the downloadable file
            feedbackList = [newRecord];
        }

        // Export downloadable JSON file containing all accumulated submissions
        try {
            const jsonString = JSON.stringify(feedbackList, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const downloadUrl = URL.createObjectURL(blob);

            const tempLink = document.createElement('a');
            tempLink.href = downloadUrl;
            tempLink.download = 'solar-explorer-feedback.json';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);

            setTimeout(() => {
                URL.revokeObjectURL(downloadUrl);
            }, 1000);

            // Display success message and reset form
            if (formStatus) {
                const countMsg = feedbackList.length === 1
                    ? '1 feedback record'
                    : `${feedbackList.length} total feedback records`;
                const storageNote = storageAvailable ? '' : ' (Note: local browser storage was restricted, but the file was generated.)';
                formStatus.textContent = `Thank you, ${nameVal}! Your feedback has been recorded and solar-explorer-feedback.json has been downloaded with ${countMsg}.${storageNote}`;
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
            }

            form.reset();
        } catch (downloadErr) {
            console.error('File download creation error:', downloadErr);
            if (formStatus) {
                formStatus.textContent = 'Your feedback was saved, but the automatic file download failed in your browser.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
        }
    });
}

/* ========================================================
   Feature I — Subtle Scroll Reveal Animations
   ======================================================== */
function initScrollReveal() {
    // Check for prefers-reduced-motion
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

// Simple HTML escaping helper for safe DOM insertion
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
