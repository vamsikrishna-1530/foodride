import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import RestaurantList from './RestaurantList';
import client from '../../api/client.js';

vi.mock('../../api/client.js', () => ({
  default: { get: vi.fn() },
}));

const renderList = () =>
  render(
    <MemoryRouter>
      <RestaurantList />
    </MemoryRouter>
  );

describe('RestaurantList', () => {
  beforeEach(() => {
    client.get.mockReset();
  });

  test('shows an error state instead of an endless spinner when the request fails', async () => {
    client.get.mockRejectedValue(new Error('Request failed with status code 500'));

    renderList();

    expect(
      await screen.findByText('Could not load restaurants. Please try again.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  test('renders restaurants returned by the API', async () => {
    client.get.mockResolvedValue({
      data: [{ _id: 'r1', name: 'Biryani House', rating: 4.4, cuisine: ['Indian'], isOpen: true }],
    });

    renderList();

    expect(await screen.findByText('Biryani House')).toBeInTheDocument();
  });
});
