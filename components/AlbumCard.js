import React from 'react';
import PropTypes from 'prop-types';

import AlbumOptions from './AlbumOptions';

function AlbumCard({ album, index }) {
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
          <AlbumOptions album={album} />
        </div>
      </div>
    </React.Fragment>
  );
}

AlbumCard.propTypes = {
  album: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default React.memo(AlbumCard);
