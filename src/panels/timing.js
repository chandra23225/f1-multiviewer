import { api } from '../api.js';
import { formatLapTime, loadingHTML, errorHTML, latestPerDriver } from '../utils.js';
import { getDriverName, getDriverAbbr, getTeamColor } from '../assets/teams.js';

export async function renderTiming(container, sessionKey, drivers) {
  container.innerHTML = loadingHTML('Fetching timing data...');
  try {
    const [positions, laps] = await Promise.all([
      api.positions(sessionKey),
      api.laps(sessionKey).catch(() => []),
    ]);

    const latest = latestPerDriver(positions);
    const sorted = Object.values(latest)
      .sort((a, b) => a.position - b.position)
      .slice(0, 20);

    if (!sorted.length) {
      container.innerHTML = errorHTML('No timing data for this session.');
      return;
    }

    // Best lap per driver
    const bestLaps = {};
    for (const l of laps) {
      if (l.lap_duration && (!bestLaps[l.driver_number] || l.lap_duration < bestLaps[l.driver_number])) {
        bestLaps[l.driver_number] = l.lap_duration;
      }
    }
    const overallBest = Math.min(...Object.values(bestLaps).filter(Boolean));

    // Latest lap number
    const lapNums = {};
    for (const l of laps) {
      if (!lapNums[l.driver_number] || l.lap_number > lapNums[l.driver_number]) {
        lapNums[l.driver_number] = l.lap_number;
      }
    }

    let html = `<div class="timing-list">`;
    for (const p of sorted) {
      const num = p.driver_number;
      const name = getDriverName(drivers, num);
      const abbr = getDriverAbbr(drivers, num);
      const color = getTeamColor(drivers, num);
      const best = bestLaps[num];
      const isPurple = best && best === overallBest;
      const lapStr = formatLapTime(best);
      const lapNum = lapNums[num] ?? '—';

      html += `
        <div class="timing-row">
          <span class="timing-pos ${p.position <= 3 ? 'top-' + p.position : ''}">${p.position}</span>
          <span class="team-bar" style="background:${color}"></span>
          <div class="timing-info">
            <span class="timing-name">${name}</span>
            <span class="timing-abbr">${abbr}</span>
          </div>
          <div class="timing-right">
            <span class="timing-lap ${isPurple ? 'purple' : ''}">${lapStr}</span>
            <span class="timing-laplabel">LAP ${lapNum}</span>
          </div>
        </div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = errorHTML('Could not load timing data.', e.message);
  }
}
