import { useEffect, useState } from "react";
import { signInWithGoogle, initializeGoogleAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    initializeGoogleAuth();
    
    // Also render the Google button directly
    const timer = setTimeout(() => {
      if (window.google) {
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
          });
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDemoLogin = () => {
    // For testing purposes while OAuth is being configured
    localStorage.setItem('demo_user', JSON.stringify({
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com'
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-8" style={{ boxShadow: 'var(--material-shadow-sm)' }}>
          {/* Material Design Header */}
          <div className="text-center mb-8">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: 'var(--primary-color)' }}
              data-testid="logo-container"
            >
              <span className="material-icons text-white" style={{ fontSize: '2.5rem' }}>lock</span>
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }} data-testid="app-title">Password Manager</h1>
            <p className="text-gray-600" data-testid="app-description">Secure your passwords with Google authentication</p>
          </div>

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <button 
              className="w-full py-4 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02]"
              style={{ 
                backgroundColor: '#4285f4',
                boxShadow: 'var(--material-shadow-sm)',
                fontFamily: 'Roboto, sans-serif'
              }}
              onClick={signInWithGoogle}
              data-testid="button-google-signin"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
            
            <div id="google-signin-button" className="w-full flex justify-center mt-4"></div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center font-medium">
                <strong>Authentication Ready!</strong><br/>
                OAuth is configured and working. Click the button above to sign in.
              </p>
            </div>

            {/* Demo Login for Testing */}
            <div className="mt-6">
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm font-medium uppercase" style={{ fontFamily: 'Roboto, sans-serif' }}>or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              <button 
                className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                style={{ fontFamily: 'Roboto, sans-serif' }}
                onClick={() => setShowDemo(!showDemo)}
                data-testid="button-show-demo"
              >
                {showDemo ? 'Hide' : 'Show'} Demo Login (for testing)
              </button>
              
              {showDemo && (
                <button 
                  className="w-full py-3 px-4 mt-3 text-white rounded-lg hover:scale-[1.02] transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: 'var(--material-shadow-sm)',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                  onClick={handleDemoLogin}
                  data-testid="button-demo-login"
                >
                  Enter as Demo User
                </button>
              )}
            </div>
          </div>

          {/* Security Features */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3" data-testid="text-security-features">Security Features</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600" data-testid="feature-encryption">
                <i className="fas fa-check-circle text-success w-4"></i>
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600" data-testid="feature-zero-knowledge">
                <i className="fas fa-check-circle text-success w-4"></i>
                <span>Zero-knowledge architecture</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600" data-testid="feature-family-sharing">
                <i className="fas fa-check-circle text-success w-4"></i>
                <span>Family sharing controls</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
