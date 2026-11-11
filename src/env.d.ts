// Public build-time settings (see .env.example). Missing values become "".
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_SITE_URL: string;
    readonly NEXT_PUBLIC_API_URL: string;
    readonly NEXT_PUBLIC_AGORA_APP_ID: string;
    readonly NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
    readonly NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESETS: string;
    readonly NEXT_PUBLIC_FIREBASE_API_KEY: string;
    readonly NEXT_PUBLIC_FIREBASE_APP_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    readonly NEXT_PUBLIC_FIREBASE_VAPID_KEY: string;
    readonly NEXT_PUBLIC_WALEX_CHAT_URL?: string;
    readonly NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  }
}
