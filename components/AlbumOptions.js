import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { toast } from 'react-toastify';

import {
  BrowseAlbumsContext,
  MyTopAlbumsDispatchContext,
  BROWSE,
  MY_TOP_10_ALBUMS,
  DELETE_TOP_ALBUM,
  PUSH_TOP_ALBUM,
  MyTopAlbumsContext,
  CurrentUserContext,
} from './AppProvider';
import apiFn from './api';
import AlbumInfo from './AlbumInfo';

export default function AlbumOptions({ album }) {
  const { selectedOption, isAdding, setIsAdding } = React.useContext(BrowseAlbumsContext);
  const { dispatchMyTopAlbums } = React.useContext(MyTopAlbumsDispatchContext);
  const { myTopAlbums, isDeleting, setIsDeleting } = React.useContext(MyTopAlbumsContext);
  const { api } = React.useContext(CurrentUserContext);
  const [info, setInfo] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleGetInfo() {
    try {
      const result = await apiFn(album.href).get();
      setInfo(result);
    } catch (error) {
      Router.push({
        pathname: '/',
      });
    }
  }

  const isAlreadyTopAlbum = React.useMemo(() => {
    return selectedOption === BROWSE && myTopAlbums.some(topAlbum => topAlbum.id === album.id);
  }, [album.id, myTopAlbums, selectedOption]);

  async function handleAddTopAlbum() {
    setIsLoading(true);
    setIsAdding(true);
    await api.post(album);
    dispatchMyTopAlbums({
      type: PUSH_TOP_ALBUM,
      payload: album,
    });
    setIsAdding(false);
    setIsLoading(false);
    toast.info(`${album.name} was added to your top albums.`);
  }

  async function handleDeleteTopAlbum() {
    setIsLoading(true);
    setIsDeleting(true);
    await api.delete(album.id);
    setIsLoading(false);
    dispatchMyTopAlbums({ type: DELETE_TOP_ALBUM, payload: { id: album.id } });
    setIsDeleting(false);
    toast.info(`${album.name} was deleted from your top albums.`);
  }

  return (
    <React.Fragment>
      <div className="buttons is-centered">
        <button className="button is-light" onClick={handleGetInfo}>
          <span className="icon">
            <i className="material-icons">info</i>
          </span>
        </button>
        {selectedOption === BROWSE && (
          <button
            className={`button is-light ${isLoading && !isAlreadyTopAlbum ? 'is-loading' : ''}`}
            disabled={isAdding || isAlreadyTopAlbum || myTopAlbums.length === 10}
            onClick={handleAddTopAlbum}
          >
            <span className="icon">
              <i className={`material-icons ${isAlreadyTopAlbum ? 'has-text-danger' : ''}`}>
                favorite
              </i>
            </span>
          </button>
        )}
        {selectedOption === MY_TOP_10_ALBUMS && (
          <button
            className={`button is-light ${isLoading ? 'is-loading' : ''}`}
            disabled={isDeleting}
            onClick={handleDeleteTopAlbum}
          >
            <span className="icon">
              <i className="material-icons">delete_forever</i>
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
