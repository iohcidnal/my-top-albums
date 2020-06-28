import React from 'react';
import fetch from 'node-fetch';

import useDebounce from './useDebounce';
import {
  TopAlbumsContext,
  PUSH_ALBUMS,
  CLEAR_ALBUMS,
  INIT_ALBUMS,
} from './TopAlbumsProvider';
import { AlbumCard } from '../components';

const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?q=';

export default function BrowseAlbums() {
  const { albums, dispatchAlbums } = React.useContext(TopAlbumsContext);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const nextRequestRef = React.useRef(null);

  const fetchAlbums = React.useCallback(async () => {
    const accessToken = localStorage.getItem('spotify-access-token');
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const fetchResult = await fetch(nextRequestRef.current, options);
    const jsonResult = await fetchResult.json();
    // TODO: handle expired token
    nextRequestRef.current = jsonResult.albums.next;

    return jsonResult;
  }, []);

  React.useEffect(() => {
    if (!debouncedSearchTerm) {
      nextRequestRef.current = null;
      dispatchAlbums({
        type: CLEAR_ALBUMS,
      });
      return;
    }

    beginSearch();

    async function beginSearch() {
      nextRequestRef.current = `${SPOTIFY_SEARCH_URL}${debouncedSearchTerm}&type=album&market=US&limit=12&offset=0`;
      const result = await fetchAlbums();
      dispatchAlbums({
        type: INIT_ALBUMS,
        payload: result.albums.items,
      });
    }
  }, [debouncedSearchTerm, dispatchAlbums, fetchAlbums]);

  async function loadMore() {
    const result = await fetchAlbums();
    dispatchAlbums({
      type: PUSH_ALBUMS,
      payload: result.albums.items,
    });
  }

  return (
    <div className="container">
      <div className="field">
        <div className="control">
          <input
            className="input is-medium"
            type="text"
            placeholder="Search album"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
      <br />
      {albums.length > 0 && (
        <React.Fragment>
          <div className="columns is-multiline is-mobile">
            {albums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
          <nav
            className="pagination is-pulled-right"
            role="navigation"
            aria-label="pagination"
          >
            <button
              onClick={loadMore}
              disabled={!nextRequestRef.current}
              className="pagination-next"
            >
              Display more
            </button>
          </nav>
        </React.Fragment>
      )}
    </div>
  );
}
