import React from 'react';
import PropTypes from 'prop-types';

export default function AlbumInfo({ album, info, setInfo }) {
  return (
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
  );
}

AlbumInfo.propTypes = {
  album: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired,
};
