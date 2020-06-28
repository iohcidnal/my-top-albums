import React from 'react';
import PropTypes from 'prop-types';

function AlbumCard({ album }) {
  console.log('AlbumCard');
  return (
    <div className="column is-one-quarter card">
      <div className="card-image">
        <figure>
          <img src={album.images[1].url} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="media-content">
          <p className="title is-4">{album.name}</p>
          <p className="subtitle is-6">{album.artists[0].name}</p>
        </div>
        <div className="buttons">
          <button className="button is-light">
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
  );
}

AlbumCard.propTypes = {
  album: PropTypes.object.isRequired,
};

export default React.memo(AlbumCard);
