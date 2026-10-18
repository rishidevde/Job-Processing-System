/**
 * Samruddhi HMS Reactive Central Store
 * Single Source of Truth for all Clinical & Operational Entities
 */

import { signal } from "@preact/signals";
import { getInitialSeed } from "../data/seed.js";

const STORAGE_KEY = "samruddhi_hms_state_v5";
const SYNC_CHANNEL = "samruddhi_hms_cross_tab_sync";

// Load initial state from localStorage or seed
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.patients && parsed.beds && parsed.queue && parsed.orders) {
        if (parsed.session) {
          parsed.session.isLoggedIn = false;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not load from localStorage, initializing from seed:", e);
  }
  return getInitialSeed();
}

// Global reactive signal holding normalized state tree
export const appState = signal(loadState());

// Active toasts signal
export const activeToasts = signal([]);

// Active blocking modal state (null or modal descriptor)
export const activeBlockingInterlock = signal(null);

// Broadcast channel for instantaneous cross-tab live synchronization
let syncChannel = null;
if (typeof BroadcastChannel !== "undefined") {
  syncChannel = new BroadcastChannel(SYNC_CHANNEL);
  syncChannel.onmessage = (event) => {
    if (event.data && event.data.type === "STATE_UPDATED") {
      appState.value = event.data.state;
    } else if (event.data && event.data.type === "RESET_STATE") {
      appState.value = getInitialSeed();
    }
  };
}

/**
 * Mutate state using an updater function (shallow or deep immutability)
 */
export function updateState(mutatorFn) {
  const current = appState.value;
  // Deep clone for clean pure state transition
  const draft = JSON.parse(JSON.stringify(current));
  mutatorFn(draft);
  appState.value = draft;

  // Persist locally
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error("Storage error:", e);
  }

  // Broadcast to other open windows / tabs
  if (syncChannel) {
    syncChannel.postMessage({ type: "STATE_UPDATED", state: draft });
  }
}

/**
 * Reset application state to canonical baseline lock
 */
export function resetState() {
  const seed = getInitialSeed();
  appState.value = seed;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch (e) {
    console.error("Storage reset error:", e);
  }

  if (syncChannel) {
    syncChannel.postMessage({ type: "RESET_STATE" });
  }

  addToast({
    type: "info",
    title: "System Reset",
    message: "All hospital data restored to canonical 18 Oct 2026 baseline."
  });
}

/**
 * Display a user-facing non-blocking notification toast
 */
export function addToast({ type = "info", title, message, duration = 4000 }) {
  const id = "toast_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
  const toast = { id, type, title, message };
  activeToasts.value = [...activeToasts.value, toast];

  setTimeout(() => {
    activeToasts.value = activeToasts.value.filter((t) => t.id !== id);
  }, duration);
}

export function removeToast(id) {
  activeToasts.value = activeToasts.value.filter((t) => t.id !== id);
}
