/* eslint-disable no-undef */
import React from 'react';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TopAlbums from '../pages/top-albums';
import {
  mockCurrentUser,
  mockAlbums,
  mockAlbumsNext,
  mockTracks,
} from '../__mocks__/response.mock';

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?q=';
const debouncedSearchTerm = 'fake-searchterm';

function sleep(period) {
  return new Promise(resolve => {
    setTimeout(resolve, period);
  });
}

let topAlbums = [];
beforeAll(() => {
  fetchMock
    .get('https://api.spotify.com/v1/me', mockCurrentUser)
    .get(
      `${SPOTIFY_SEARCH_URL}${debouncedSearchTerm}&type=album&market=US&limit=12&offset=0`,
      mockAlbums
    )
    .get(
      'https://api.spotify.com/v1/search?query=chris+tomlin&type=album&market=US&offset=12&limit=12',
      mockAlbumsNext
    )
    .get('https://api.spotify.com/v1/albums/2XOKt6AVcxdBs1Za7AxGj2', {
      tracks: mockTracks,
    })
    .get(`/api/top-albums/${mockCurrentUser.id}`, topAlbums)
    .post(`/api/top-albums/${mockCurrentUser.id}`, (url, options) => {
      const payload = JSON.parse(options.body);
      topAlbums.push(payload);
      return payload;
    })
    .delete(`/api/top-albums/${mockCurrentUser.id}`, (url, options) => {
      const payload = JSON.parse(options.body);
      topAlbums = topAlbums.filter(a => a.id !== payload.id);
      return { result: `${payload.id} deleted successfully` };
    });
});

afterEach(cleanup);

describe('Application', () => {
  describe('Initial Load', () => {
    it('should render and get current user', async () => {
      act(() => {
        render(<TopAlbums />);
      });
      expect(screen.getByText(/browse/i)).toBeInTheDocument();
      expect(screen.getByText(/my top 10 albums/i)).toBeInTheDocument();
      expect(await screen.findByText(mockCurrentUser.display_name)).toBeInTheDocument();
      expect(screen.getByTitle(/badge top albums count/i).innerHTML).toBe('0');
    });
  });

  describe('Browse Albums', () => {
    beforeEach(async () => {
      await beginSearch();
    });

    it('should search and display all the results', async () => {
      const elements = screen.getAllByRole('figure', { alt: /album image/i });
      expect(elements.length).toBe(5);

      for (const album of mockAlbums.albums.items) {
        expect(screen.getByText(album.name)).toBeInTheDocument();
      }
      expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
    });

    it('should append and display more results', async () => {
      const element = screen.getByRole('button', {
        name: /display more/i,
      });
      await act(async () => {
        await userEvent.click(element);
      });

      const elements = screen.getAllByRole('figure', { alt: /album image/i });
      expect(elements.length).toBe(10);

      for (const album of mockAlbums.albums.items) {
        expect(screen.getByText(album.name)).toBeInTheDocument();
      }
      for (const album of mockAlbumsNext.albums.items) {
        expect(screen.getByText(album.name)).toBeInTheDocument();
      }
      expect(element).toBeDisabled();
    });

    it("should be able to view album's tracks", async () => {
      const elements = screen.getAllByRole('button', { name: /info/i });
      expect(elements.length).toBeGreaterThan(1);

      await act(async () => {
        await userEvent.click(elements[0]);
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      for (const track of mockTracks.items) {
        expect(screen.getByText(track.name)).toBeInTheDocument();
      }

      const element = screen.getByRole('button', { name: /close/i });
      await userEvent.click(element);
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should be able to add albums to top albums collection', async () => {
      const elements = screen.getAllByRole('button', {
        name: /favorite/i,
      });
      expect(elements.length).toBeGreaterThan(1);

      // Add three albums to the collection
      await act(async () => {
        await userEvent.click(elements[0]);
      });
      await act(async () => {
        await userEvent.click(elements[1]);
      });
      await act(async () => {
        await userEvent.click(elements[2]);
      });

      await waitFor(() => {
        expect(screen.getByTitle(/badge top albums count/i).innerHTML).toBe('3');
      });
    });

    async function beginSearch() {
      act(() => {
        render(<TopAlbums />);
      });

      const element = await screen.findByPlaceholderText(/search album/i);
      await userEvent.type(element, debouncedSearchTerm);

      await act(async () => {
        await sleep(800);
      });
    }
  });

  describe('My Top Albums', () => {
    beforeEach(async () => {
      await gotoTopAlbums();
    });

    it('should display selected top albums', async () => {
      const elements = screen.getAllByRole('figure', { alt: /album image/i });

      expect(elements.length).toBe(3);
      expect(screen.getByText(mockAlbums.albums.items[0].name)).toBeInTheDocument();
      expect(screen.getByText(mockAlbums.albums.items[1].name)).toBeInTheDocument();
      expect(screen.getByText(mockAlbums.albums.items[2].name)).toBeInTheDocument();
    });

    it('should be able to delete an album', async () => {
      let elements = screen.getAllByRole('button', { name: /delete_forever/i });
      await act(async () => {
        await userEvent.click(elements[0]);
      });

      elements = screen.getAllByRole('figure', { alt: /album image/i });
      expect(elements.length).toBe(2);
      expect(screen.queryByText(mockAlbums.albums.items[0].name)).toBeNull();
      expect(screen.getByText(mockAlbums.albums.items[1].name)).toBeInTheDocument();
      expect(screen.getByText(mockAlbums.albums.items[2].name)).toBeInTheDocument();
      expect(screen.getByTitle(/badge top albums count/i).innerHTML).toBe('2');
    });

    async function gotoTopAlbums() {
      act(() => {
        render(<TopAlbums />);
      });
      const element = screen.getByText(/my top 10 albums/i);
      await act(async () => {
        await userEvent.click(element);
      });
    }
  });
});
