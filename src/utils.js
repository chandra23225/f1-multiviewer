/**
 * Format seconds into M:SS.mmm lap time string
 * @param {number|null} seconds
 * @returns {string}
 */
export function formatLapTime(seconds) {
  if (!seconds) return '—:——.———';
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3).padStart(6, '0');
  return `${m}:${s}`;
}

/**
 * Build a loading skeleton HTML block
 * @param {string} message
 * @returns {string}
 */
export function loadingHTML(message = 'Loading...') {
  return `<div class="loading"><div class="spinner"></div><p>${message}</p></div>`;
}

/**
 * Build an error message HTML block
 * @param {string} message
 * @param {string} [detail]
 * @returns {string}
 */
export function errorHTML(message, detail = '') {
  return `<div class="error-msg">
    <span class="error-icon">⚠</span>
    <p>${message}</p>
    ${detail ? `<small>${detail}</small>` : ''}
  </div>`;
}

/**
 * Get the latest entry per driver from an array of timestamped objects
 * @param {Array} items - must have driver_number and date fields
 * @returns {Object} map of driver_number -> latest item
 */
export function latestPerDriver(items) {
  const map = {};
  for (const item of items) {
    const key = item.driver_number;
    if (!map[key] || item.date > map[key].date) {
      map[key] = item;
    }
  }
  return map;
}
