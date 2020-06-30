import React from 'react';
import PropTypes from 'prop-types';

import {
  BrowseAlbumsContext,
  MyTopAlbumsDispatchContext,
  BROWSE,
  MY_TOP_10_ALBUMS,
  DELETE_TOP_ALBUM,
  PUSH_TOP_ALBUM,
} from './AppProvider';
import fetchSpotify from './fetchSpotify';
import AlbumInfo from './AlbumInfo';

export default function AlbumOptions({ album }) {
  const { selectedOption } = React.useContext(BrowseAlbumsContext);
  const { dispatchMyTopAlbums } = React.useContext(MyTopAlbumsDispatchContext);
  const [info, setInfo] = React.useState();

  async function handleGetInfo() {
    const result = await fetchSpotify(album.href);
    setInfo(result);
  }

  function handleAddTopAlbum() {
    dispatchMyTopAlbums({ type: PUSH_TOP_ALBUM, payload: album });
  }

  function handleDeleteTopAlbum() {
    dispatchMyTopAlbums({ type: DELETE_TOP_ALBUM, payload: { id: album.id } });
  }

  return (
    <React.Fragment>
      <div className="buttons">
        <button className="button is-light" onClick={handleGetInfo}>
          <span className="icon">
            <i className="fas fa-info" />
          </span>
        </button>
        {selectedOption === BROWSE && (
          <button className="button is-light" onClick={handleAddTopAlbum}>
            <span className="icon">
              <i className="fas fa-heart" />
            </span>
          </button>
        )}
        {selectedOption === MY_TOP_10_ALBUMS && (
          <button className="button is-light" onClick={handleDeleteTopAlbum}>
            <span className="icon">
              <i className="fas fa-trash-alt" />
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
