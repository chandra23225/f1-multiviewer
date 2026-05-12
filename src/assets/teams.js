export const TEAM_COLORS = {
  'Red Bull Racing': '#3671C6',
  'Ferrari': '#E8002D',
  'Mercedes': '#27F4D2',
  'McLaren': '#FF8000',
  'Aston Martin': '#229971',
  'Alpine': '#FF87BC',
  'Williams': '#64C4FF',
  'RB': '#6692FF',
  'Kick Sauber': '#52E252',
  'Haas F1 Team': '#B6BABD',
};

export const DRIVER_TEAMS = {
  1: 'Red Bull Racing', 11: 'Red Bull Racing',
  16: 'Ferrari',        55: 'Ferrari',
  44: 'Mercedes',       63: 'Mercedes',
  4:  'McLaren',        81: 'McLaren',
  14: 'Aston Martin',   18: 'Aston Martin',
  10: 'Alpine',         31: 'Alpine',
  23: 'Williams',       2:  'Williams',
  3:  'RB',             22: 'RB',
  77: 'Kick Sauber',    24: 'Kick Sauber',
  20: 'Haas F1 Team',   27: 'Haas F1 Team',
};

export function getTeamColor(drivers, driverNumber) {
  const d = drivers.find(x => x.driver_number == driverNumber);
  if (d?.team_colour) return `#${d.team_colour}`;
  const team = DRIVER_TEAMS[driverNumber];
  return team ? (TEAM_COLORS[team] ?? '#888') : '#888';
}

export function getDriverName(drivers, driverNumber) {
  const d = drivers.find(x => x.driver_number == driverNumber);
  return d ? (d.full_name || d.name_acronym || `#${driverNumber}`) : `#${driverNumber}`;
}

export function getDriverAbbr(drivers, driverNumber) {
  const d = drivers.find(x => x.driver_number == driverNumber);
  return d?.name_acronym ?? '';
}
