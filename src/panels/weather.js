import { api } from '../api.js';
import { loadingHTML, errorHTML } from '../utils.js';

const FLAGS = {
  GREEN:  { cls: 'flag-green',  label: 'Green Flag',       icon: '🟢' },
  YELLOW: { cls: 'flag-yellow', label: 'Yellow Flag',      icon: '🟡' },
  RED:    { cls: 'flag-red',    label: 'Red Flag',         icon: '🔴' },
  SC:     { cls: 'flag-sc',     label: 'Safety Car',       icon: '🟠' },
  VSC:    { cls: 'flag-sc',     label: 'Virtual Safety Car', icon: '🟠' },
  CHEQUERED: { cls: 'flag-green', label: 'Chequered Flag', icon: '🏁' },
};

export async function renderWeather(container, sessionKey) {
  container.innerHTML = loadingHTML('Fetching weather...');
  try {
    const weather = await api.weather(sessionKey);
    if (!weather.length) {
      container.innerHTML = errorHTML('No weather data available.');
      return;
    }

    const w = weather[weather.length - 1];
    const isRaining = (w.rainfall ?? 0) > 0;

    // Determine track status from race control
    let flagInfo = FLAGS.GREEN;
    try {
      const rc = await api.raceControl(sessionKey);
      const lastFlag = [...rc].reverse().find(m => m.flag && FLAGS[m.flag]);
      if (lastFlag) flagInfo = FLAGS[lastFlag.flag];
    } catch (_) {}

    const updatedAt = w.date
      ? new Date(w.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '—';

    container.innerHTML = `
      <div class="weather-grid">
        <div class="weather-cell">
          <div class="weather-icon">${isRaining ? '🌧️' : '☀️'}</div>
          <div class="weather-label">CONDITIONS</div>
          <div class="weather-val">${isRaining ? 'WET' : 'DRY'}</div>
        </div>
        <div class="weather-cell">
          <div class="weather-icon">🌡️</div>
          <div class="weather-label">AIR TEMP</div>
          <div class="weather-val">${w.air_temperature?.toFixed(1) ?? '—'}°C</div>
        </div>
        <div class="weather-cell">
          <div class="weather-icon">🏎️</div>
          <div class="weather-label">TRACK TEMP</div>
          <div class="weather-val">${w.track_temperature?.toFixed(1) ?? '—'}°C</div>
        </div>
        <div class="weather-cell">
          <div class="weather-icon">💨</div>
          <div class="weather-label">WIND</div>
          <div class="weather-val">${w.wind_speed?.toFixed(1) ?? '—'} m/s</div>
        </div>
        <div class="weather-cell">
          <div class="weather-icon">🧭</div>
          <div class="weather-label">WIND DIR</div>
          <div class="weather-val">${w.wind_direction ?? '—'}°</div>
        </div>
        <div class="weather-cell">
          <div class="weather-icon">💧</div>
          <div class="weather-label">HUMIDITY</div>
          <div class="weather-val">${w.humidity?.toFixed(0) ?? '—'}%</div>
        </div>
      </div>
      <div class="track-status ${flagInfo.cls}">
        <span class="flag-icon">${flagInfo.icon}</span>
        <span class="flag-label">${flagInfo.label}</span>
        <span class="weather-updated">Updated ${updatedAt}</span>
      </div>`;
  } catch (e) {
    container.innerHTML = errorHTML('Could not load weather data.', e.message);
  }
}
