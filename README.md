# Your World Apps — Command Deck

Marketing hub for **Your World Apps** Production titles. The page *is* the command deck: Weather Radar, Your World Hunt, and Your World Market are stations with interactive demos, sales copy, and Google Play CTAs.

## Local preview

Open the file in a browser:

```bash
xdg-open /workspace/your-world-apps-hub/index.html
# or
firefox /workspace/your-world-apps-hub/index.html
```

Single self-contained `index.html` (embedded CSS/JS) plus `assets/` icons. No build step.

## GitHub Pages + custom domain

Live at **https://yourworldapps.si/** (`www.yourworldapps.si` redirects there). Served by GitHub Pages from `main` with the
custom domain in the `CNAME` file; DNS at Spaceship: apex A records 185.199.108-111.153, `www` and `hunt` CNAME to
`appzdj2003-svg.github.io`. The old https://appzdj2003-svg.github.io/your-world-apps-hub/ URL redirects here.

- Your World Hunt site: https://hunt.yourworldapps.si/ (repo `your-world-hunt-site`)

- Weather detail site: https://appzdj2003-svg.github.io/your-world-weather-radar-site/

## Production apps on this deck

| Station | Package | Play |
|--------|---------|------|
| Weather Radar | `com.yourworld.weatheranalyzer` | [Play](https://play.google.com/store/apps/details?id=com.yourworld.weatheranalyzer) |
| Your World Hunt | `com.yourworld.hunt` | [Play](https://play.google.com/store/apps/details?id=com.yourworld.hunt) |
| Your World Market | `com.yourworld.analyzer` | [Play](https://play.google.com/store/apps/details?id=com.yourworld.analyzer) |

Closed/draft apps are intentionally omitted.
