import React from 'react';

import { MyTopAlbumsContext } from './AppProvider';
import AlbumCard from './AlbumCard';
import SortableTopAlbums from './SortableTopAlbums';

export default function MyTopAlbums() {
  const { myTopAlbums, isReorder } = React.useContext(MyTopAlbumsContext);

  if (myTopAlbums.length === 0) return null;

  return (
    <div className="container">
      <div className="columns is-multiline is-mobile">
        {myTopAlbums.map((album, index) => (
          <AlbumCard
            key={album.id}
            album={album}
            isSelectable={false}
            isRemoveable
            index={index + 1}
          />
        ))}
      </div>
      {isReorder && <SortableTopAlbums />}
    </div>
  );
}
