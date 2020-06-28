import React from 'react';
import PropTypes from 'prop-types';

import fetchSpotify from './fetchSpotify';

function AlbumCard({ album }) {
  console.log('AlbumCard');
  const [info, setInfo] = React.useState();

  async function handleGetInfo() {
    const result = await fetchSpotify(album.href);
    setInfo(result);
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
            <p className="title is-4">{album.name}</p>
            <p className="subtitle is-6">{album.artists[0].name}</p>
          </div>
          <div className="buttons">
            <button className="button is-light" onClick={handleGetInfo}>
              <span className="icon">
                <i className="fas fa-info" />
              </span>
            </button>
            <button className="button is-light">
              <span className="icon">
                <i className="fas fa-heart" />
              </span>
            </button>
          </div>
        </div>
      </div>
      {info && (
        <div className="modal is-active">
          <div className="modal-background"></div>
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
};

export default React.memo(AlbumCard);
