import React from 'react';
import PropTypes from 'prop-types';

import AlbumOptions from './AlbumOptions';

function AlbumListItem({ album, index }) {
  console.log('AlbumListItem');

  return (
    <React.Fragment>
      <div className="box">
        <article className="media">
          <div className="media-left">
            <figure className="image is-64x64">
              <img src={album.images[2].url} alt="Album image" />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-5">
              {index && <span className="has-text-info-dark">{`${index}. `}</span>}
              {album.name}
            </p>
            <p className="subtitle is-6">{album.artists[0].name}</p>
          </div>
          <AlbumOptions album={album} />
        </article>
      </div>
    </React.Fragment>
  );
}

AlbumListItem.propTypes = {
  album: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default React.memo(AlbumListItem);
