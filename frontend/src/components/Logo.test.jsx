import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Logo from './Logo';

describe('Logo', () => {
  test('renders the FoodRide wordmark by default', () => {
    render(<Logo />);
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Ride')).toBeInTheDocument();
  });

  test('hides the wordmark when showText is false', () => {
    render(<Logo showText={false} />);
    expect(screen.queryByText('Food')).not.toBeInTheDocument();
  });
});
