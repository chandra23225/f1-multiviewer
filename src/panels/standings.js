import { api } from '../api.js';
import { loadingHTML, errorHTML } from '../utils.js';
import { TEAM_COLORS } from '../assets/teams.js';

const TYRES = ['S','M','H','M','S','H','M','S','H','M'];

function resolveTeamColor(constructorName) {
  const entry = Object.entries(TEAM_COLORS).find(([k]) =>
    constructorName.toLowerCase().includes(k.split(' ')[0].toLowerCase())
  );
  return entry?.[1] ?? '#888';
}

export async function renderStandings(container) {
  container.innerHTML = loadingHTML('Fetching standings...');
  try {
    const data = await api.driverStandings();
    const list = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    let html = `
      <table class="standings-table">
        <thead>
          <tr>
            <th>POS</th>
            <th>DRIVER</th>
            <th>TEAM</th>
            <th>PTS</th>
            <th>W</th>
          </tr>
        </thead>
        <tbody>`;

    list.slice(0, 10).forEach((s, i) => {
      const teamName = s.Constructors[0]?.name ?? '—';
      const color = resolveTeamColor(teamName);
      const shortTeam = teamName
        .replace('Formula One Team', '')
        .replace('F1 Team', '')
        .trim();
      const tyre = TYRES[i] ?? 'M';
      const posClass = ['', 'gold', 'silver', 'bronze'][i + 1] ?? '';

      html += `
          <tr>
            <td><span class="pos-badge ${posClass}">${s.position}</span></td>
            <td>
              <div class="driver-cell">
                <span class="team-dot" style="background:${color}"></span>
                <div>
                  <span class="driver-last">${s.Driver.familyName}</span>
                  <span class="driver-first">${s.Driver.givenName}</span>
                </div>
              </div>
            </td>
            <td class="team-name">${shortTeam}</td>
            <td class="pts">${s.points}</td>
            <td><span class="tyre tyre-${tyre}">${tyre}</span></td>
          </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = errorHTML('Could not load standings.', e.message);
  }
}
