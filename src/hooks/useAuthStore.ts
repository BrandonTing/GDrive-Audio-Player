import { useSyncExternalStore } from 'react';

// Function to get the current snapshot of the access token from localStorage
function getAccessTokenSnapshot() {
  return localStorage.getItem('google_access_token');
}

// Function to subscribe to changes in localStorage
function subscribeToLocalStorage(callback: () => void) {
  // The 'storage' event fires when a localStorage item is changed,
  // but only in *other* tabs/windows. For changes in the current tab,
  // we rely on our own code updating localStorage and then calling the callback.
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
}

export function useAuthStore() {
  // useSyncExternalStore takes three arguments:
  // 1. subscribe: A function that takes a callback and returns an unsubscribe function.
  // 2. getSnapshot: A function that returns the current value of the store.
  // 3. getServerSnapshot (optional): A function for server-side rendering.
  //    For client-side only, it can return the same as getSnapshot.
  const accessToken = useSyncExternalStore(
    subscribeToLocalStorage,
    getAccessTokenSnapshot,
    getAccessTokenSnapshot, // For SSR, return initial client-side value
  );

  return !!accessToken; // Return true if token exists, false otherwise
}

// We'll also need a way to notify the store when *we* change it
// (e.g., after login or logout) so that useSyncExternalStore can re-render.
// This is a simple way to do it, by dispatching a custom event.
export function notifyAuthStoreChange() {
  window.dispatchEvent(new Event('storage')); // Trigger a 'storage' event
}
