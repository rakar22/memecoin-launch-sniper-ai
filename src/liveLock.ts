import { config } from "./config.js";
import { audit } from "./audit.js";
import { state } from "./store.js";

export interface LiveGate {
  locked: boolean;
  reasons: string[];
}

export function liveGate(): LiveGate {
  const reasons: string[] = [];
  if (config.tradingMode !== "LIVE") reasons.push("TRADING_MODE is not LIVE");
  if (!config.live.unlockPhrase) reasons.push("LIVE_UNLOCK_PHRASE missing");
  if (!config.live.secondConfirmation) reasons.push("LIVE_SECOND_CONFIRMATION missing");
  if (config.live.unlockPhrase && config.live.unlockPhrase !== "I_ACCEPT_TOTAL_LOSS") {
    reasons.push("LIVE_UNLOCK_PHRASE does not match required confirmation");
  }
  if (config.live.secondConfirmation && config.live.secondConfirmation !== "ENABLE_LIVE") {
    reasons.push("LIVE_SECOND_CONFIRMATION does not match required confirmation");
  }
  if (!config.walletPrivateKey) reasons.push("no dedicated bot wallet configured");
  if (state.emergency) reasons.push("emergency stop active");
  const locked = reasons.length > 0;
  return { locked, reasons };
}
