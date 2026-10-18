/**
 * Samruddhi HMS Live System Clock Service
 * Provides real-time reactive time and date with seconds that works
 * in development, production, and deployed hosting environments.
 */

import { signal } from "@preact/signals";
import { appState } from "./store.js";

export function formatLiveClock(dateObj = new Date()) {
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const date = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return {
    time,
    date,
    full: `${date}, ${time}`,
    iso: dateObj.toISOString(),
    raw: dateObj
  };
}

// Reactive signal with initial live system time
export const liveClock = signal(formatLiveClock());

// Start live tick interval (runs in browser, both local and deployed)
let intervalId = null;

export function initLiveClock() {
  if (typeof window === "undefined") return;

  const tick = () => {
    const updated = formatLiveClock();
    liveClock.value = updated;

    // Keep store session synced without full state clone
    if (appState.value && appState.value.session) {
      appState.value.session.clockTime = updated.time;
      appState.value.session.clockDate = updated.date;
    }
  };

  // Immediate sync
  tick();

  if (!intervalId) {
    intervalId = setInterval(tick, 1000);
  }
}

// Auto-initialize in browser
if (typeof window !== "undefined") {
  initLiveClock();
}
