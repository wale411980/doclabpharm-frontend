import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestDeviceToken(): Promise<string | null> {
  try {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Please allow notifications to receive video calls.");
        return null;
      }
    }

    // ✅ Register the service worker
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    // ✅ Wait until the service worker is ready
    const swRegistration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      localStorage.setItem("deviceToken", token);
      localStorage.setItem("deviceType:", "web");
      return token;
    } else {
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token.", err);
    return null;
  }
}
