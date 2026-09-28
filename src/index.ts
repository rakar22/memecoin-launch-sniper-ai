import { createServer } from "./api/server.js";
import { config, ensureDataDir } from "./config.js";
import { startPumpPortal } from "./detectors/pumpportal.js";
import { startLogsDetector } from "./detectors/logsSubscribe.js";
import { evaluateExits } from "./engines/paper.js";
import { onLaunch } from "./pipeline.js";
import { audit } from "./audit.js";
import { liveGate } from "./liveLock.js";
import { notifyCandidate } from "./api/telegram.js";
import { state } from "./store.js";

ensureDataDir();
audit("BOOT", { mode: config.tradingMode, profile: config.profile, live: liveGate() });

const app = createServer();
app.listen(config.httpPort, () => {
  console.log(`desk http://localhost:${config.httpPort}/dashboard`);
  console.log(`LIVE lock: ${liveGate().locked ? "ON" : "OFF"}`);
});
