/**
 * Samruddhi HMS Hash Router
 */

import { signal } from "@preact/signals";
import { activeBlockingInterlock, addToast } from "./store.js";

function parseHash() {
  const hash = window.location.hash || "#/login";
  const [pathPart, queryPart] = hash.split("?");
  const query = {};

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const [key, val] of searchParams.entries()) {
      query[key] = val;
    }
  }

  return {
    full: hash,
    path: pathPart,
    query
  };
}

export const currentRoute = signal(parseHash());

window.addEventListener("hashchange", () => {
  if (activeBlockingInterlock.value) {
    // Interlock active: safety warning
    addToast({
      type: "warning",
      title: "Action Interlocked",
      message: `Complete or resolve the required safety action (${activeBlockingInterlock.value}) before navigating away.`
    });
  }
  currentRoute.value = parseHash();
});

export function navigate(path) {
  if (activeBlockingInterlock.value) {
    addToast({
      type: "warning",
      title: "Action Interlocked",
      message: "Safety interlock engaged. Please resolve active dialog first."
    });
    return;
  }
  window.location.hash = path;
}

export function initRouter() {
  currentRoute.value = parseHash();
}
