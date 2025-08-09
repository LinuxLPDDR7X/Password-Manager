import { queryClient } from "./queryClient";

declare global {
  interface Window {
    google: any;
  }
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export const initializeGoogleAuth = () => {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }
};

export const handleCredentialResponse = async (response: any) => {
  try {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential: response.credential }),
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      window.location.reload();
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
};

export const signInWithGoogle = () => {
  if (window.google) {
    // Use popup instead of One Tap for better compatibility
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to renderButton if prompt doesn't work
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          buttonContainer.innerHTML = '';
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
          });
        }
      }
    });
  }
};

export const signOut = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    queryClient.clear();
    window.location.reload();
  } catch (error) {
    console.error('Sign out error:', error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
