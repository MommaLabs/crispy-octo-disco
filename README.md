# TimeFi Growth Kit

## How it works
- **timefi-sdk**: The core package for interacting with TimeFi on Stacks.
- **timefi-growth-bot**: Automatically installs the SDK and runs a check (drives download metrics).
- **timefi-starter-app**: A reference implementation for developers.

## Run locally
```bash
cd timefi-growth-bot
npm install
node index.js
```

## Automation ⚡ (Growth Pulse)
This kit includes a GitHub Action in `.github/workflows/growth-pulse.yml` that:
- Runs automatically every 30 minutes.
- Performs `npm install` for all packages to ensure a consistent stream of SDK downloads.
- To activate: **Commit and push** these changes to your GitHub repository.

## SDK Capabilities
The bot now lists the available methods in the `timefi-sdk@0.1.0`. You can explore:
- `TimeFiClient`: The main entry point for protocol interactions.
- `uintCV`, `principalCV`: Helper functions for Stacks Clarity values.
- `formatSTX`, `formatDate`: Utility functions for displaying data.
