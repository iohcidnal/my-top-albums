import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import {
  BrowseAlbumsContext,
  MyTopAlbumsDispatchContext,
  BROWSE,
  MY_TOP_10_ALBUMS,
  DELETE_TOP_ALBUM,
  PUSH_TOP_ALBUM,
  MyTopAlbumsContext,
} from './AppProvider';
import fetchSpotify from './fetchSpotify';
import AlbumInfo from './AlbumInfo';

export default function AlbumOptions({ album }) {
  const { selectedOption } = React.useContext(BrowseAlbumsContext);
  const { dispatchMyTopAlbums } = React.useContext(MyTopAlbumsDispatchContext);
  const { myTopAlbums } = React.useContext(MyTopAlbumsContext);
  const [info, setInfo] = React.useState();

  async function handleGetInfo() {
    try {
      const result = await fetchSpotify(album.href);
      setInfo(result);
    } catch (error) {
      Router.push({
        pathname: '/',
      });
    }
  }

  const isAlreadyTopAlbum = React.useMemo(() => {
    return selectedOption === BROWSE && myTopAlbums.some(topAlbum => topAlbum.id === album.id);
  }, [album.id, myTopAlbums, selectedOption]);

  function handleAddTopAlbum() {
    dispatchMyTopAlbums({ type: PUSH_TOP_ALBUM, payload: album });
  }

  function handleDeleteTopAlbum() {
    dispatchMyTopAlbums({ type: DELETE_TOP_ALBUM, payload: { id: album.id } });
  }

  return (
    <React.Fragment>
      <div className="buttons is-centered">
        <button className="button is-light" onClick={handleGetInfo}>
          <span className="icon">
            <i className="material-icons">info</i>
          </span>
        </button>
        {selectedOption === BROWSE && (
          <button
            className="button is-light"
            disabled={isAlreadyTopAlbum || myTopAlbums.length === 10}
            onClick={handleAddTopAlbum}
          >
            <span className="icon">
              <i className={`material-icons ${isAlreadyTopAlbum ? 'has-text-danger' : ''}`}>
                favorite
              </i>
            </span>
          </button>
        )}
        {selectedOption === MY_TOP_10_ALBUMS && (
          <button className="button is-light" onClick={handleDeleteTopAlbum}>
            <span className="icon">
              <i className="material-icons">delete_forever</i>
            </span>
          </button>
        )}
      </div>
      {info && <AlbumInfo album={album} info={info} setInfo={setInfo} />}
    </React.Fragment>
  );
}

AlbumOptions.propTypes = {
  album: PropTypes.object.isRequired,
};
