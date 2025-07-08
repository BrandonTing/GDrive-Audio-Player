import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Login from './Login';
import { useGoogleLogin } from '@react-oauth/google';
import { notifyAuthStoreChange } from '../hooks/useAuthStore';
import { mock, describe, it, expect, beforeEach, afterEach } from 'bun:test'; // Import afterEach

// Mock @react-oauth/google
mock.module('@react-oauth/google', () => ({
  useGoogleLogin: mock(), // Use mock() for creating mock functions
}));

// Mock localStorage
const localStorageMock = {
  setItem: mock(), // Use mock() instead of mock.fn()
  getItem: mock(), // Use mock() instead of mock.fn()
  removeItem: mock(), // Use mock() instead of mock.fn()
  clear: mock(), // Use mock() instead of mock.fn()
};


// Mock notifyAuthStoreChange
mock.module('../hooks/useAuthStore', () => ({
  notifyAuthStoreChange: mock(), // Use mock() instead of mock.fn()
}));

describe('Login', () => {
  const mockLoginFn = mock(); // Use mock() instead of mock.fn()
  const mockOnLoginSuccess = mock(); // Use mock() instead of mock.fn()
  let mockOnSuccessCallback: (tokenResponse: any) => void;
  let mockOnErrorCallback: (errorResponse: any) => void;
  let originalLocalStorage: Storage;
  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    mock.restore();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
    
    localStorageMock.setItem.mockClear(); // Clear calls for localStorage.setItem
    localStorageMock.getItem.mockClear(); // Clear calls for localStorage.getItem
    localStorageMock.removeItem.mockClear(); // Clear calls for localStorage.removeItem
    localStorageMock.clear.mockClear(); // Clear calls for localStorage.clear
    (notifyAuthStoreChange as ReturnType<typeof mock>).mockClear(); // Clear calls for notifyAuthStoreChange
    mockOnLoginSuccess.mockClear(); // Clear calls for mockOnLoginSuccess
    // Reset the mock for useGoogleLogin to capture the callbacks
    (useGoogleLogin as ReturnType<typeof mock>).mockImplementation((options: any) => {
      mockOnSuccessCallback = options.onSuccess;
      mockOnErrorCallback = options.onError;
      return mockLoginFn;
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });

    cleanup(); // Clean up the DOM after each test
  });

  it('renders the Sign in with Google button', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('calls the login function on button click', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
    expect(mockLoginFn).toHaveBeenCalledTimes(1);
  });

  it('handles successful login', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    const mockTokenResponse = { access_token: 'mock_access_token', expires_in: 3600 };
    mockOnSuccessCallback(mockTokenResponse);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('google_access_token', 'mock_access_token');
    expect(notifyAuthStoreChange).toHaveBeenCalledTimes(1);
    expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles failed login', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));

    const mockErrorResponse = { error: 'login_failed' };
    mockOnErrorCallback(mockErrorResponse);

    // Verify that localStorage.setItem and notifyAuthStoreChange are NOT called
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(notifyAuthStoreChange).not.toHaveBeenCalled();
    expect(mockOnLoginSuccess).not.toHaveBeenCalled(); // onLoginSuccess should not be called on error
  });
});