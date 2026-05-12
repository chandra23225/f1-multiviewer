# 🏎️ F1 Multiviewer

> A live Formula 1 dashboard showing timing, standings, telemetry and weather — all in one view.

![F1 Multiviewer](https://img.shields.io/badge/F1-Multiviewer-e10600?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMSAxNEg5VjhIMTF2OHptNCAwaC0yVjhoMnY4eiIvPjwvc3ZnPg==)
![Data](https://img.shields.io/badge/Data-OpenF1%20API-27F4D2?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## Panels

| Panel | Description |
|-------|-------------|
| **Live Timing** | Session positions, best lap times, team colours |
| **Driver Standings** | 2025 championship standings with points & tyre indicators |
| **Car Telemetry** | Speed, gear, RPM, throttle, brake, DRS for the race leader |
| **Track & Weather** | Air/track temp, wind, humidity, rainfall, flag status |

## Stack

- Vanilla HTML / CSS / JS — zero dependencies, zero build step
- ES Modules for clean separation of concerns
- [OpenF1 API](https://openf1.org) — live session, timing, telemetry, weather
- [Jolpica Ergast](https://api.jolpi.ca/ergast) — championship standings

## Project Structure

```
f1-multiviewer/
├── index.html              # Entry point
├── styles/
│   ├── main.css            # Layout, header, tokens
│   ├── panels.css          # Panel-specific styles
│   └── components.css      # Shared components, animations
└── src/
    ├── main.js             # App init, orchestration
    ├── api.js              # All API calls
    ├── utils.js            # Helpers (formatLapTime, etc.)
    ├── assets/
    │   └── teams.js        # Team colours & driver mappings
    └── panels/
        ├── timing.js       # Live timing renderer
        ├── standings.js    # Standings renderer
        ├── telemetry.js    # Telemetry renderer
        └── weather.js      # Weather renderer
```

## Running Locally

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/f1-multiviewer.git
cd f1-multiviewer

# Serve (ES modules need a server, not file://)
npx serve .
# or
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

> **Note:** ES Modules require a local server — opening `index.html` directly via `file://` won't work.

## Live Demo

🔗 [YOUR_USERNAME.github.io/f1-multiviewer](https://YOUR_USERNAME.github.io/f1-multiviewer)

## Data Refresh

Data auto-refreshes every **30 seconds**. Use the ↻ Refresh button for an immediate update.

## License

MIT
