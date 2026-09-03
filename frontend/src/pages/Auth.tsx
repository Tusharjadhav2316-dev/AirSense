import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, LocateFixed, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthBrandPanel, AuthTabs, HealthProfilePicker } from '../components/auth';
import type { HealthProfile } from '../types';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, signInWithGoogle, signInWithApple } = useAuth();

  // Synchronize active mode with URL route (/login vs /signup)
  const isLoginPage = location.pathname === '/login';
  const [mode, setMode] = useState<'login' | 'signup'>(isLoginPage ? 'login' : 'signup');

  useEffect(() => {
    setMode(location.pathname === '/login' ? 'login' : 'signup');
    setError(null);
  }, [location.pathname]);

  const handleTabChange = (tab: 'login' | 'signup') => {
    setMode(tab);
    setError(null);
    navigate(tab === 'login' ? '/login' : '/signup', { replace: true });
  };

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeLocation, setHomeLocationInput] = useState('Pune, Maharashtra');
  const [selectedProfile, setSelectedProfile] = useState<HealthProfile>('asthma');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Error State
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        await register({
          email,
          password,
          health_profile: selectedProfile,
          home_location: homeLocation,
        });
      } else {
        await login({ email, password });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle({
        healthProfile: selectedProfile,
        homeLocation: homeLocation,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in could not be completed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    setAppleLoading(true);
    try {
      await signInWithApple({
        healthProfile: selectedProfile,
        homeLocation: homeLocation,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Apple sign-in could not be completed. Please try again.');
    } finally {
      setAppleLoading(false);
    }
  };

  const isAnyLoading = loading || googleLoading || appleLoading;

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-white font-sans antialiased text-[#0B1220]">
      
      {/* ================================================================= */}
      {/* LEFT PANEL (40–42% Width on Desktop, Banner on Mobile)            */}
      {/* ================================================================= */}
      <div className="md:col-span-5 lg:col-span-5 flex flex-col">
        <AuthBrandPanel />
      </div>

      {/* ================================================================= */}
      {/* RIGHT PANEL (58–60% Width on Desktop) — AUTH FORM                 */}
      {/* ================================================================= */}
      <div className="md:col-span-7 lg:col-span-7 bg-white flex flex-col justify-center items-center px-6 py-10 sm:px-10 lg:px-16 overflow-y-auto">
        
        <div className="w-full max-w-[440px] mx-auto space-y-6">
          
          {/* Top Tabs: Log In | Sign Up */}
          <AuthTabs activeTab={mode} onTabChange={handleTabChange} />

          {/* Form Header Title */}
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl sm:text-[26px] text-[#0B1220] tracking-tight">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              {mode === 'signup' ? 'Step 1 of 2' : 'Please enter your details to continue.'}
            </p>
          </div>

          {/* Error Alert Display */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-xs text-[#D64545] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D64545] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5 font-sans">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isAnyLoading}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 transition-all shadow-2xs disabled:opacity-60"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-800 font-sans">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-xs text-slate-500 hover:text-[#1D4ED8] font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isAnyLoading}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 transition-all shadow-2xs pr-10 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Signup-Specific Fields: Location & Health Profile */}
            {mode === 'signup' && (
              <>
                {/* Home Location Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5 font-sans">
                    Where is your home location?
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search city or use current location"
                      value={homeLocation}
                      onChange={(e) => setHomeLocationInput(e.target.value)}
                      disabled={isAnyLoading}
                      className="w-full pl-9 pr-9 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/15 transition-all shadow-2xs disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setHomeLocationInput('Pune, Maharashtra')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1D4ED8] cursor-pointer p-0.5"
                      title="Use current location"
                    >
                      <LocateFixed className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Health Profile Selector */}
                <HealthProfilePicker
                  selectedProfile={selectedProfile}
                  onSelect={setSelectedProfile}
                />
              </>
            )}

            {/* Primary Action CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isAnyLoading}
                className="w-full bg-[#1D4ED8] hover:bg-[#1E40AF] active:scale-[0.99] text-white font-semibold text-sm rounded-xl py-3 sm:py-3.5 shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 select-none"
              >
                <span>{loading ? 'Processing...' : mode === 'signup' ? 'Continue' : 'Log In'}</span>
              </button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-slate-400 font-sans">
              or continue with
            </span>
          </div>

          {/* Social Auth Buttons (Google & Apple) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAnyLoading}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl py-2.5 sm:py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{googleLoading ? 'Signing in...' : 'Google'}</span>
            </button>

            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={isAnyLoading}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 text-xs font-semibold rounded-xl py-2.5 sm:py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              <svg className="w-4 h-4 fill-current text-slate-900 shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.68-.82 1.14-1.97 1.01-3.12-1 .04-2.2.67-2.9 1.49-.62.73-1.16 1.9-1.02 3.03 1.12.09 2.23-.58 2.91-1.4"/>
              </svg>
              <span>{appleLoading ? 'Signing in...' : 'Apple'}</span>
            </button>
          </div>

          {/* Footer Tab Navigation Link */}
          <div className="pt-3 text-center text-xs text-slate-500 font-sans">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('signup')}
                  className="text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
