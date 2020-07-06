import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import {
  MyTopAlbumsContext,
  MyTopAlbumsDispatchContext,
  INIT_TOP_ALBUMS,
  CurrentUserContext,
} from './AppProvider';

const SortableItem = SortableElement(({ album, orderNumber }) => (
  <div className="box moveable">
    <article className="media">
      <div className="media-left">
        <figure className="image is-64x64">
          <img src={album.images[2].url} alt="Album image" />
        </figure>
      </div>
      <div className="media-content">
        <div className="content">
          <strong>
            {orderNumber + 1}. {album.name}
          </strong>
          <br />
          {album.artists[0].name}
        </div>
      </div>
    </article>
    <style jsx>
      {`
        .sortableHelper {
          z-index: 999;
        }
        .moveable {
          cursor: move;
        }
      `}
    </style>
  </div>
));

const SortableList = SortableContainer(({ albums }) => {
  return (
    <div>
      {albums.map((album, index) => (
        <SortableItem key={album.id} index={index} album={album} orderNumber={index} />
      ))}
    </div>
  );
});

export default function SortableTopAlbums() {
  const { myTopAlbums, setIsReorder } = React.useContext(MyTopAlbumsContext);
  const { dispatchMyTopAlbums } = React.useContext(MyTopAlbumsDispatchContext);
  const { api } = React.useContext(CurrentUserContext);
  const [orderedAlbums, setOrderedAlbums] = React.useState(myTopAlbums);
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSaveReorder() {
    setIsSaving(true);
    await api.put(orderedAlbums);
    dispatchMyTopAlbums({ type: INIT_TOP_ALBUMS, payload: orderedAlbums });
    setIsSaving(false);
    setIsReorder(false);
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => setIsReorder(false)} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Reorder My Top 10 Albums</p>
        </header>
        <div className="modal-card-body">
          <div className="notification is-info is-light">Drag and drop album to reorder.</div>
          <div className="content">
            <SortableList
              helperClass="sortableHelper"
              albums={orderedAlbums}
              onSortEnd={({ oldIndex, newIndex }) =>
                setOrderedAlbums(arrayMove(orderedAlbums, oldIndex, newIndex))
              }
            />
          </div>
        </div>
        <footer className="modal-card-foot" style={{ justifyContent: 'flex-end' }}>
          <button className="button" onClick={() => setIsReorder(false)}>
            Close
          </button>
          <button
            className={`button is-success ${isSaving ? 'is-loading' : ''}`}
            onClick={handleSaveReorder}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
}
