import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase modules
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('@/services/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import {
  signInAdmin,
  signOutAdmin,
  getCurrentUser,
  onAuthChange,
  isAuthenticated,
} from '@/services/authService';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signInAdmin', () => {
    it('should sign in and return admin user', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
      };

      vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
        user: mockUser,
      } as any);

      const result = await signInAdmin('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
      expect(result).toEqual({
        uid: 'test-uid',
        email: 'test@example.com',
      });
    });

    it('should throw error when sign in fails', async () => {
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
        new Error('Invalid credentials')
      );

      await expect(signInAdmin('test@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('signOutAdmin', () => {
    it('should call signOut', async () => {
      vi.mocked(signOut).mockResolvedValue();

      await signOutAdmin();

      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from auth', () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      (auth as any).currentUser = mockUser;

      const result = getCurrentUser();

      expect(result).toBe(mockUser);
    });

    it('should return null when no user is signed in', () => {
      (auth as any).currentUser = null;

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('onAuthChange', () => {
    it('should call callback with admin user when user is signed in', () => {
      const mockCallback = vi.fn();
      const mockUser = { uid: 'test-uid', email: 'test@example.com' };
      const mockUnsubscribe = vi.fn();

      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback: any) => {
        callback(mockUser);
        return mockUnsubscribe;
      });

      const unsubscribe = onAuthChange(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith({
        uid: 'test-uid',
        email: 'test@example.com',
      });
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call callback with null when user is signed out', () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      vi.mocked(onAuthStateChanged).mockImplementation((auth, callback: any) => {
        callback(null);
        return mockUnsubscribe;
      });

      onAuthChange(mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is signed in', () => {
      (auth as any).currentUser = { uid: 'test-uid' };

      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when no user is signed in', () => {
      (auth as any).currentUser = null;

      expect(isAuthenticated()).toBe(false);
    });
  });
});
