import React from 'react';
import PropTypes from 'prop-types';

import { MyTopAlbumsContext } from './AppProvider';
import AlbumCard from './AlbumCard';
import SortableTopAlbums from './SortableTopAlbums';
import AlbumListItem from './AlbumListItem';

export default function MyTopAlbums({ isGridDisplay }) {
  const { myTopAlbums, isReorder } = React.useContext(MyTopAlbumsContext);

  if (myTopAlbums.length === 0) {
    return (
      <div className="container ">
        <div className="is-size-5 has-text-centered ">You haven't made your selections yet.</div>
      </div>
    );
  }

  return (
    <div className="container">
      {isGridDisplay && (
        <div className="columns is-multiline is-mobile">
          {myTopAlbums.map((album, index) => (
            <AlbumCard key={album.id} album={album} index={index + 1} />
          ))}
        </div>
      )}
      {!isGridDisplay && (
        <div className="content">
          {myTopAlbums.map((album, index) => (
            <AlbumListItem key={album.id} album={album} index={index + 1} />
          ))}
        </div>
      )}
      {isReorder && <SortableTopAlbums />}
    </div>
  );
}

MyTopAlbums.propTypes = {
  isGridDisplay: PropTypes.bool.isRequired,
};
