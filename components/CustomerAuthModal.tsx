import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, AlertCircle, Loader2, Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import type { Customer } from '../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (customer: Customer) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  login,
  register,
  resetPassword,
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError(null);
    setResetSent(false);
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    resetForm();
    setMode(newMode);
  };

  const mapFirebaseError = (err: { code?: string }): string => {
    switch (err.code) {
      case 'auth/invalid-email':
        return t('customerAuthErrorEmail') || 'Invalid email address';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return t('customerAuthErrorPassword') || 'Incorrect password';
      case 'auth/user-not-found':
        return t('customerAuthErrorNotFound') || 'No account found with this email';
      case 'auth/email-already-in-use':
        return t('customerAuthErrorExists') || 'An account with this email already exists';
      case 'auth/weak-password':
        return t('customerAuthErrorWeak') || 'Password must be at least 6 characters';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return t('customerAuthErrorGeneric') || 'Something went wrong. Please try again.';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      resetForm();
      onClose();
    } catch (err: unknown) {
      setError(mapFirebaseError(err as { code?: string }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError(t('customerAuthErrorMismatch') || 'Passwords do not match');
      return;
    }
    if (!displayName.trim()) {
      setError(t('customerFullName') + ' is required');
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password, displayName);
      resetForm();
      onClose();
    } catch (err: unknown) {
      setError(mapFirebaseError(err as { code?: string }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: unknown) {
      setError(mapFirebaseError(err as { code?: string }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[110] rounded-lg border border-brand-border shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? t('customerSignInTitle') || 'Sign in' : t('customerCreateTitle') || 'Create account'}
      >
        {/* Header */}
        <div className="p-8 pb-0">
          {mode === 'forgot' && (
            <button
              onClick={() => switchMode('login')}
              className="flex items-center gap-1 text-brand-muted hover:text-brand-dark text-sm mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              {t('customerLogin') || 'Sign In'}
            </button>
          )}

          <div className="text-center mb-6">
            <div className={`w-16 h-16 ${mode === 'register' ? 'bg-brand-accent/10' : 'bg-brand-primary-light'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {mode === 'register' ? (
                <UserPlus size={28} className="text-brand-accent" />
              ) : (
                <LogIn size={28} className="text-brand-primary" />
              )}
            </div>
            <h2 className="text-xl font-bold text-brand-dark">
              {mode === 'login' && (t('customerSignInTitle') || 'Sign in to your account')}
              {mode === 'register' && (t('customerCreateTitle') || 'Create your account')}
              {mode === 'forgot' && (t('customerForgotPassword') || 'Reset password')}
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" role="form">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  {t('customerEmail') || 'Email Address'}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    disabled={isLoading}
                    className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50"
                    aria-label={t('customerEmail') || 'Email'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  {t('customerPassword') || 'Password'}
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50"
                    aria-label={t('customerPassword') || 'Password'}
                  />
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-sm text-brand-primary hover:text-brand-primary-dark font-medium transition-colors"
                >
                  {t('customerForgotPassword') || 'Forgot password?'}
                </button>
              </div>

              {error && (
                <div role="alert" className="flex items-center gap-2 text-brand-critical text-sm bg-brand-critical/10 border border-brand-critical/20 rounded-lg px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-3.5 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <LogIn size={20} />
                )}
                {isLoading ? '...' : (t('customerLogin') || 'Sign In')}
              </button>

              <p className="text-center text-sm text-brand-muted">
                {t('customerNoAccount') || "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-brand-primary hover:text-brand-primary-dark font-semibold transition-colors"
                >
                  {t('customerRegister') || 'Create Account'}
                </button>
              </p>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" role="form">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  {t('customerFullName') || 'Full Name'}
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe"
                    required
                    disabled={isLoading}
                    className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50"
                    aria-label={t('customerFullName') || 'Full Name'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  {t('customerEmail') || 'Email Address'}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    disabled={isLoading}
                    className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50"
                    aria-label={t('customerEmail') || 'Email'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  {t('customerPassword') || 'Password'}
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50"
                    aria-label={t('customerPassword') || 'Password'}
                  />
                </div>
                <p className="text-xs text-brand-text-tertiary mt-1">{t('customerPasswordReq') || 'At least 6 characters'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  {t('customerConfirmPassword') || 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    disabled={isLoading}
                    className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50"
                    aria-label={t('customerConfirmPassword') || 'Confirm Password'}
                  />
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-center gap-2 text-brand-critical text-sm bg-brand-critical/10 border border-brand-critical/20 rounded-lg px-4 py-3">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-3.5 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <UserPlus size={20} />
                )}
                {isLoading ? '...' : (t('customerRegister') || 'Create Account')}
              </button>

              <p className="text-center text-sm text-brand-muted">
                {t('customerHasAccount') || 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-brand-primary hover:text-brand-primary-dark font-semibold transition-colors"
                >
                  {t('customerLogin') || 'Sign In'}
                </button>
              </p>
            </form>
          )}

          {/* Forgot Password Form */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4" role="form">
              {resetSent ? (
                <div className="text-center py-4">
                  <CheckCircle size={48} className="text-brand-success mx-auto mb-4" />
                  <p className="text-brand-dark font-medium">{t('customerResetSent') || 'Password reset email sent. Check your inbox.'}</p>
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="mt-4 text-brand-primary hover:text-brand-primary-dark font-semibold text-sm transition-colors"
                  >
                    {t('customerLogin') || 'Back to Sign In'}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-brand-muted mb-4">Enter your email and we'll send you a link to reset your password.</p>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1.5">
                      {t('customerEmail') || 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-tertiary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                        disabled={isLoading}
                        className="w-full bg-white border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-dark placeholder:text-brand-text-tertiary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all disabled:opacity-50"
                        aria-label={t('customerEmail') || 'Email'}
                      />
                    </div>
                  </div>

                  {error && (
                    <div role="alert" className="flex items-center gap-2 text-brand-critical text-sm bg-brand-critical/10 border border-brand-critical/20 rounded-lg px-4 py-3">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-3.5 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Mail size={20} />}
                    {isLoading ? '...' : 'Send Reset Link'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerAuthModal;
