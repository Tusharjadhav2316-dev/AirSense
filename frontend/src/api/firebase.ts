import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'airsense-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'airsense-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'airsense-ai.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Initialize Firebase safely
export const firebaseApp =
  getApps().length > 0
    ? getApp()
    : firebaseConfig.apiKey
    ? initializeApp(firebaseConfig)
    : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export interface OAuthResult {
  email: string;
  displayName?: string;
  idToken?: string;
  provider: 'google' | 'apple';
}

/**
 * Load Google Identity Services SDK dynamically
 */
function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const existing = document.getElementById('google-gsi-client');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google SDK')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Sign in directly via Google Cloud OAuth 2.0 (Google Identity Services)
 */
async function signInWithGoogleCloudClient(clientId: string): Promise<OAuthResult> {
  await loadGoogleGsiScript();
  const google = (window as any).google;
  if (!google?.accounts?.oauth2) {
    throw new Error('Google Sign-In SDK is unavailable.');
  }

  return new Promise((resolve, reject) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error_description || tokenResponse.error || 'Google sign-in failed.'));
          return;
        }
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          if (!res.ok) {
            throw new Error('Could not fetch Google profile details.');
          }
          const profile = await res.json();
          resolve({
            email: profile.email,
            displayName: profile.name,
            idToken: tokenResponse.access_token,
            provider: 'google',
          });
        } catch (err: any) {
          reject(err);
        }
      },
      error_callback: (err: any) => {
        reject(new Error(err.message || 'Google sign-in popup was closed or blocked.'));
      },
    });

    tokenClient.requestAccessToken({ prompt: 'select_account' });
  });
}

/**
 * Trigger real Google OAuth Sign-in flow via Google Cloud OAuth or Firebase
 */
export async function authenticateWithGoogle(): Promise<OAuthResult> {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
  if (googleClientId && typeof googleClientId === 'string' && googleClientId.trim()) {
    return await signInWithGoogleCloudClient(googleClientId.trim());
  }

  if (auth) {
    try {
      const cred: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      if (!user.email) {
        throw new Error('No email found associated with this Google account.');
      }
      const idToken = await user.getIdToken();
      return {
        email: user.email,
        displayName: user.displayName || undefined,
        idToken,
        provider: 'google',
      };
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled.');
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups.');
      }
      throw new Error(error.message || 'Google sign-in could not be completed. Please try again.');
    }
  }

  // If no Google Client ID or Firebase keys are active in the build:
  throw new Error(
    'Google Sign-In is not configured in this build. Please add VITE_GOOGLE_CLIENT_ID in your Vercel frontend Settings -> Environment Variables, and click Redeploy.'
  );
}

/**
 * Trigger Apple OAuth Sign-in flow via popup
 */
export async function authenticateWithApple(): Promise<OAuthResult> {
  if (!auth) {
    throw new Error(
      'Apple Sign-In requires Apple Developer Console configuration (Service ID & Private Key). Please configure Apple Auth in your provider console.'
    );
  }

  try {
    const cred: UserCredential = await signInWithPopup(auth, appleProvider);
    const user = cred.user;
    if (!user.email) {
      throw new Error('No email found associated with this Apple account.');
    }
    const idToken = await user.getIdToken();
    return {
      email: user.email,
      displayName: user.displayName || undefined,
      idToken,
      provider: 'apple',
    };
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Apple sign-in was cancelled.');
    }
    if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
      throw new Error(
        'Apple Sign-In is not enabled in Firebase Console. Please configure your Apple Developer Team ID & Service Key in Firebase Authentication.'
      );
    }
    throw new Error(error.message || 'Apple sign-in could not be completed. Please try again.');
  }
}
