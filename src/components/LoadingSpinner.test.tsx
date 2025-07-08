import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'bun:test';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders the loading spinner with text', () => {
    render(<LoadingSpinner />);

    // Check if the loading text is present
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    // Check if the spinner element is present (e.g., by its role or class)
    // A more robust check might involve checking for specific ARIA attributes
    // or the presence of the animate-spin class.
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
