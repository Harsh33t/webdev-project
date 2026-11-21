/**
 * tests/spaceWeather.test.js
 * Verification suite for NOAA SWPC space weather feed and fallback model.
 */
const { getSpaceWeather } = require('../controllers/telemetryController');

describe('Space Weather Telemetry Feed', () => {
    test('fetches or calculates planetary K-index and solar wind speed', async () => {
        let responseData = null;
        const mockRes = {
            json: (data) => { responseData = data; },
            status: () => mockRes
        };
        await getSpaceWeather({}, mockRes);
        expect(responseData).toBeDefined();
        expect(responseData.success).toBe(true);
        expect(responseData.kpIndex).toBeGreaterThanOrEqual(0);
        expect(responseData.solarWindSpeedKms).toBeGreaterThan(200);
    });
});
