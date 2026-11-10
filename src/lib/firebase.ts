import { initializeApp, getApps } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messagingPromise: Promise<Messaging | null> | null = null;

/**
 * Firebase Cloud Messaging, or null where the browser cannot use it
 * (server rendering, iOS Safari outside an installed web app, missing config).
 * Calling getMessaging() unguarded crashes the whole page on those browsers.
 */
export function getMessagingSafe(): Promise<Messaging | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => {
        if (!supported || !firebaseConfig.apiKey) return null;
        const app = getApps()[0] ?? initializeApp(firebaseConfig);
        return getMessaging(app);
      })
      .catch(() => null);
  }

  return messagingPromise;
}

/**
 * Subscribe to foreground push messages. Returns an unsubscribe function that
 * is safe to call even if messaging never became available.
 */
export function onForegroundMessage(
  handler: (payload: MessagePayload) => void
): () => void {
  let unsubscribe: (() => void) | null = null;
  let cancelled = false;

  getMessagingSafe().then((messaging) => {
    if (messaging && !cancelled) unsubscribe = onMessage(messaging, handler);
  });

  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}

export { getToken };
