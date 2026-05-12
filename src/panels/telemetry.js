import { api } from '../api.js';
import { loadingHTML, errorHTML, latestPerDriver } from '../utils.js';
import { getDriverName, getTeamColor } from '../assets/teams.js';

export async function renderTelemetry(container, labelEl, sessionKey, drivers) {
  container.innerHTML = loadingHTML('Fetching telemetry...');
  try {
    const positions = await api.positions(sessionKey);
    const latest = latestPerDriver(positions);
    const leader = Object.values(latest).sort((a, b) => a.position - b.position)[0];
    const driverNum = leader?.driver_number ?? 1;

    const telem = await api.carData(driverNum, sessionKey);
    if (!telem.length) {
      container.innerHTML = errorHTML('No telemetry data available.');
      return;
    }

    const t = telem[telem.length - 1];
    const name = getDriverName(drivers, driverNum);
    const color = getTeamColor(drivers, driverNum);
    const drsOn = t.drs >= 10;

    if (labelEl) {
      labelEl.innerHTML = `<span class="telem-driver-dot" style="background:${color}"></span>${name}`;
    }

    const rpmPct = Math.min(100, ((t.rpm ?? 0) / 15000) * 100);

    container.innerHTML = `
      <div class="telem-grid">
        <div class="telem-cell telem-gear">
          <div class="telem-label">GEAR</div>
          <div class="gear-num">${t.n_gear || 'N'}</div>
        </div>
        <div class="telem-cell">
          <div class="telem-label">SPEED</div>
          <div class="telem-val">${t.speed ?? 0}</div>
          <div class="telem-unit">km/h</div>
        </div>
        <div class="telem-cell">
          <div class="telem-label">RPM</div>
          <div class="telem-val telem-val--sm">${(t.rpm ?? 0).toLocaleString()}</div>
          <div class="bar-track"><div class="bar-fill bar-fill--rpm" style="width:${rpmPct}%"></div></div>
        </div>
        <div class="telem-cell telem-drs ${drsOn ? 'drs-active' : ''}">
          <div class="telem-label">DRS</div>
          <div class="telem-val telem-val--sm">${drsOn ? 'OPEN' : 'CLOSED'}</div>
        </div>
        <div class="telem-cell">
          <div class="telem-label">THROTTLE</div>
          <div class="telem-val telem-val--sm">${t.throttle ?? 0}%</div>
          <div class="bar-track"><div class="bar-fill bar-fill--throttle" style="width:${t.throttle ?? 0}%"></div></div>
        </div>
        <div class="telem-cell">
          <div class="telem-label">BRAKE</div>
          <div class="telem-val telem-val--sm">${t.brake ?? 0}%</div>
          <div class="bar-track"><div class="bar-fill bar-fill--brake" style="width:${t.brake ?? 0}%"></div></div>
        </div>
      </div>`;
  } catch (e) {
    container.innerHTML = errorHTML('Could not load telemetry.', e.message);
  }
}
