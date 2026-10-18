/**
 * Samruddhi HMS Authentication & Session Management
 * Provides rock-solid, cross-screen login and sign-out guarantees.
 */

import { appState, updateState, activeBlockingInterlock, addToast } from "./store.js";
import { currentRoute } from "./router.js";
import { dispatch } from "./command.js";

/**
 * Universal Sign Out Function
 * Can be called from any screen, topbar, sidebar, or modal.
 * Clears active blocking dialogs, records audit trail, and immediately transitions to #/login.
 */
export function logoutUser() {
  try {
    // 1. Release any blocking interlocks (allergy alerts, payment timeouts, critical readbacks)
    activeBlockingInterlock.value = null;

    // 2. Dispatch official LOGOUT command to record WORM audit trail
    dispatch("LOGOUT");

    // 3. Mark session explicitly logged out in state
    updateState((draft) => {
      if (draft.session) {
        draft.session.isLoggedIn = false;
      }
    });

    // 4. Force router and window hash to #/login synchronously
    window.location.hash = "#/login";
    currentRoute.value = {
      full: "#/login",
      path: "#/login",
      query: {}
    };

    addToast({
      type: "info",
      title: "Session Locked",
      message: "Workstation session has been safely closed."
    });
  } catch (err) {
    console.error("Logout error, forcing fallback redirect:", err);
    window.location.hash = "#/login";
    window.location.reload();
  }
}

/**
 * Check if current session is authenticated
 */
export function isAuthenticated() {
  const session = appState.value && appState.value.session;
  return session && session.isLoggedIn !== false;
}
