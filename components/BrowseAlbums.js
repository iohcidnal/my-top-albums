import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import useDebounce from './useDebounce';
import { BrowseAlbumsContext, PUSH_ALBUMS, CLEAR_ALBUMS, INIT_ALBUMS } from './AppProvider';
import AlbumCard from './AlbumCard';
import fetchSpotify from './fetchSpotify';
import AlbumListItem from './AlbumListItem';

const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search?q=';

export default function BrowseAlbums({ isGridDisplay }) {
  const { searchTerm, setSearchTerm, albums, dispatchAlbums, nextRequestRef } = React.useContext(
    BrowseAlbumsContext
  );
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [shouldInitAlbums, setShouldInitAlbums] = React.useState(false);

  const fetchAlbums = React.useCallback(async () => {
    try {
      const result = await fetchSpotify(nextRequestRef.current);
      nextRequestRef.current = result.albums.next;
      return result;
    } catch (error) {
      Router.push({
        pathname: '/',
      });
    }
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
      try {
        nextRequestRef.current = `${SPOTIFY_SEARCH_URL}${debouncedSearchTerm}&type=album&market=US&limit=12&offset=0`;
        const result = await fetchAlbums();
        dispatchAlbums({
          type: INIT_ALBUMS,
          payload: result.albums.items,
        });
      } catch (error) {
        Router.push({
          pathname: '/',
        });
      }
    }
  }, [debouncedSearchTerm, dispatchAlbums, fetchAlbums, nextRequestRef, shouldInitAlbums]);

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
          {isGridDisplay && (
            <div className="columns is-multiline is-mobile">
              {albums.map(album => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
          {!isGridDisplay && (
            <div className="content">
              {albums.map(album => (
                <AlbumListItem key={album.id} album={album} />
              ))}
            </div>
          )}
          <nav className="pagination is-pulled-right" role="navigation" aria-label="pagination">
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

BrowseAlbums.propTypes = {
  isGridDisplay: PropTypes.bool.isRequired,
};
