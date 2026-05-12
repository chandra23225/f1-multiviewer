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

    // Determine if session is live (started within last 4 hours) or historical
    const sessionStart = s.date_start ? new Date(s.date_start) : null;
    const sessionEnd   = s.date_end   ? new Date(s.date_end)   : null;
    const now = new Date();
    const isLive = sessionStart && sessionEnd
      ? now >= sessionStart && now <= sessionEnd
      : sessionStart
        ? (now - sessionStart) < 4 * 60 * 60 * 1000
        : false;

    updateDataSourceBadge(isLive, s);
  } catch (_) {}
}

function updateDataSourceBadge(isLive, session) {
  const badge = document.getElementById('dataSourceBadge');
  const sessionDate = session?.date_start
    ? new Date(session.date_start).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  if (isLive) {
    badge.className = 'data-badge data-badge--live';
    badge.textContent = '● LIVE SESSION';
  } else {
    badge.className = 'data-badge data-badge--historical';
    badge.textContent = `⏱ LAST SESSION · ${sessionDate}`;
  }

  // Label the three OpenF1 panels
  const note = isLive ? 'Live data' : `Data from last session · ${sessionDate}`;
  ['timingNote', 'telemNote', 'weatherNote'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = note;
  });
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
