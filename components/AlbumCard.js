import React from 'react';
import PropTypes from 'prop-types';

import fetchSpotify from './fetchSpotify';
import { PUSH_TOP_ALBUM, MyTopAlbumsDispatchContext, DELETE_TOP_ALBUM } from './AppProvider';

function AlbumCard({ album, isSelectable = true, isRemoveable = false, index }) {
  console.log('AlbumCard');
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
      <div className="column is-one-quarter card">
        <div className="card-image">
          <figure>
            <img src={album.images[1].url} alt="Album image" />
          </figure>
        </div>
        <div className="card-content">
          <div className="media-content">
            <p className="title is-5">
              {index && <span className="has-text-info-dark">{`${index}. `}</span>}
              {album.name}
            </p>
            <p className="subtitle is-6">{album.artists[0].name}</p>
          </div>
          <div className="buttons">
            <button className="button is-light" onClick={handleGetInfo}>
              <span className="icon">
                <i className="fas fa-info" />
              </span>
            </button>
            {isSelectable && (
              <button className="button is-light" onClick={handleAddTopAlbum}>
                <span className="icon">
                  <i className="fas fa-heart" />
                </span>
              </button>
            )}
            {isRemoveable && (
              <button className="button is-light" onClick={handleDeleteTopAlbum}>
                <span className="icon">
                  <i className="fas fa-trash-alt" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      {info && (
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{album.name}</p>
            </header>
            <div className="modal-card-body">
              <div className="columns">
                <div className="column">
                  <div className="box">
                    <figure>
                      <img src={album.images[1].url} alt="Album image" />
                    </figure>
                  </div>
                </div>
                <div className="column">
                  <div className="columns">
                    <div className="column">Artist</div>
                    <div className="column">{album.artists[0].name}</div>
                  </div>
                  <div className="columns">
                    <div className="column">Release date</div>
                    <div className="column">{album.release_date}</div>
                  </div>
                  <div className="content">
                    Tracks
                    <ul>
                      {info.tracks.items.map(track => (
                        <li key={track.id}>{track.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <footer className="modal-card-foot">
              <button className="button" onClick={() => setInfo(null)}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

AlbumCard.propTypes = {
  album: PropTypes.object.isRequired,
  isSelectable: PropTypes.bool,
  isRemoveable: PropTypes.bool,
  index: PropTypes.number,
};

export default React.memo(AlbumCard);
