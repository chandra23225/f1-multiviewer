const BASE = 'https://api.openf1.org/v1';
const ERGAST = 'https://api.jolpi.ca/ergast/f1';

/**
 * Generic JSON fetch with error handling
 * @param {string} url
 * @returns {Promise<any>}
 */
async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

export const api = {
  /** Latest or specific session metadata */
  session: (key = 'latest') =>
    get(`${BASE}/sessions?session_key=${key}`),

  /** All drivers in a session */
  drivers: (sessionKey) =>
    get(`${BASE}/drivers?session_key=${sessionKey}`),

  /** Position data for a session */
  positions: (sessionKey) =>
    get(`${BASE}/position?session_key=${sessionKey}`),

  /** Lap data for a session */
  laps: (sessionKey) =>
    get(`${BASE}/laps?session_key=${sessionKey}`),

  /** Car telemetry for a specific driver */
  carData: (driverNumber, sessionKey) =>
    get(`${BASE}/car_data?driver_number=${driverNumber}&session_key=${sessionKey}`),

  /** Weather data for a session */
  weather: (sessionKey) =>
    get(`${BASE}/weather?session_key=${sessionKey}`),

  /** Race control messages (flags etc.) */
  raceControl: (sessionKey) =>
    get(`${BASE}/race_control?session_key=${sessionKey}`),

  /** Current season driver standings via Jolpica/Ergast */
  driverStandings: () =>
    get(`${ERGAST}/current/driverStandings.json`),
};
