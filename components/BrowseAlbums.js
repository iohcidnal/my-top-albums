import React from 'react';

import useDebounce from './useDebounce';
import {
  TopAlbumsContext,
  PUSH_ALBUMS,
  CLEAR_ALBUMS,
  INIT_ALBUMS,
} from './TopAlbumsProvider';
import { fetchSpotify, AlbumCard } from '../components';

const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?q=';

export default function BrowseAlbums() {
  const {
    searchTerm,
    setSearchTerm,
    albums,
    dispatchAlbums,
    nextRequestRef,
  } = React.useContext(TopAlbumsContext);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [shouldInitAlbums, setShouldInitAlbums] = React.useState(false);

  const fetchAlbums = React.useCallback(async () => {
    const result = await fetchSpotify(nextRequestRef.current);
    nextRequestRef.current = result.albums.next;
    return result;
  }, [nextRequestRef]);

  React.useEffect(() => {
    if (!debouncedSearchTerm) {
      nextRequestRef.current = null;
      dispatchAlbums({
        type: CLEAR_ALBUMS,
      });
      return;
    }

    if (shouldInitAlbums) initAlbums();

    async function initAlbums() {
      nextRequestRef.current = `${SPOTIFY_SEARCH_URL}${debouncedSearchTerm}&type=album&market=US&limit=12&offset=0`;
      const result = await fetchAlbums();
      dispatchAlbums({
        type: INIT_ALBUMS,
        payload: result.albums.items,
      });
    }
  }, [
    debouncedSearchTerm,
    dispatchAlbums,
    fetchAlbums,
    nextRequestRef,
    shouldInitAlbums,
  ]);

  function handleChange(event) {
    setShouldInitAlbums(true);
    setSearchTerm(event.target.value);
  }

  async function loadMore() {
    const result = await fetchAlbums();
    setShouldInitAlbums(false);
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
            onChange={handleChange}
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
