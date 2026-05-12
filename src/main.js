import { api } from './api.js';
import { renderTiming } from './panels/timing.js';
import { renderStandings } from './panels/standings.js';
import { renderTelemetry } from './panels/telemetry.js';
import { renderWeather } from './panels/weather.js';

let sessionKey = 'latest';
let drivers = [];

async function initSession() {
  try {
    const sessions = await api.session('latest');
    if (!sessions.length) return;
    const s = sessions[0];
    sessionKey = s.session_key;

    document.getElementById('circuitName').textContent = s.circuit_short_name || s.location || '—';
    document.getElementById('sessionType').textContent = s.session_name || '—';
    document.getElementById('sessionYear').textContent = s.year || '—';
    document.getElementById('roundNum').textContent = s.meeting_key || '—';
  } catch (_) {}
}

async function initDrivers() {
  try {
    drivers = await api.drivers(sessionKey);
  } catch (_) {
    drivers = [];
  }
}

async function refreshAll() {
  await Promise.all([
    renderTiming(
      document.getElementById('timingPanel'),
      sessionKey,
      drivers
    ),
    renderStandings(
      document.getElementById('standingsPanel')
    ),
    renderTelemetry(
      document.getElementById('telemPanel'),
      document.getElementById('telemDriverLabel'),
      sessionKey,
      drivers
    ),
    renderWeather(
      document.getElementById('weatherPanel'),
      sessionKey
    ),
  ]);

  // Update last-refreshed timestamp
  const el = document.getElementById('lastRefresh');
  if (el) el.textContent = new Date().toLocaleTimeString();
}

async function init() {
  await initSession();
  await initDrivers();
  await refreshAll();

  // Auto-refresh every 30 seconds
  setInterval(refreshAll, 30_000);
}

// Manual refresh button
document.getElementById('refreshBtn')?.addEventListener('click', refreshAll);

init();
