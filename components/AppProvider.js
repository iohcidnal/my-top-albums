import React from 'react';
import Router from 'next/router';

import apiFn from './api';

export const BrowseAlbumsContext = React.createContext();
export const CurrentUserContext = React.createContext();
export const MyTopAlbumsContext = React.createContext();
export const MyTopAlbumsDispatchContext = React.createContext();

export const INIT_ALBUMS = 'INIT_ALBUMS';
export const PUSH_ALBUMS = 'PUSH_ALBUMS';
export const CLEAR_ALBUMS = 'CLEAR_ALBUMS';

export const INIT_TOP_ALBUMS = 'INIT_TOP_ALBUMS';
export const PUSH_TOP_ALBUM = 'PUSH_TOP_ALBUM';
export const DELETE_TOP_ALBUM = 'DELETE_TOP_ALBUM';

export const BROWSE = 'Browse';
export const MY_TOP_10_ALBUMS = 'Top Albums';

const initCurrentUser = { id: null };

function albumsReducer(state, action) {
  switch (action.type) {
    case INIT_ALBUMS:
      return [...action.payload];
    case PUSH_ALBUMS:
      return [...state, ...action.payload];
    case CLEAR_ALBUMS:
      return [];
    default:
      return state;
  }
}

function myTopAlbumsReducer(state, action) {
  switch (action.type) {
    case INIT_TOP_ALBUMS:
      return [...action.payload];
    case PUSH_TOP_ALBUM:
      return [...state, action.payload];
    case DELETE_TOP_ALBUM: {
      const result = state.filter(a => a.id !== action.payload.id);
      return result;
    }
    default:
      return state;
  }
}

export function AppProvider(props) {
  const [currentUser, setCurrentUser] = React.useState(initCurrentUser);

  const [selectedOption, setSelectedOption] = React.useState(BROWSE);
  const [albums, dispatchAlbums] = React.useReducer(albumsReducer, []);
  const [searchTerm, setSearchTerm] = React.useState('');
  const nextRequestRef = React.useRef();
  const [isAdding, setIsAdding] = React.useState(false);

  const [myTopAlbums, dispatchMyTopAlbums] = React.useReducer(myTopAlbumsReducer, []);
  const [isReorder, setIsReorder] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const api = React.useMemo(() => {
    if (!currentUser.id) return null;
    return apiFn(`/api/top-albums/${currentUser.id}`);
  }, [currentUser.id]);

  React.useEffect(() => {
    getCurrentUser();

    async function getCurrentUser() {
      try {
        const result = await apiFn('https://api.spotify.com/v1/me').get();
        setCurrentUser(result);
      } catch (error) {
        Router.push({
          pathname: '/',
        });
      }
    }
  }, []);

  React.useEffect(() => {
    if (currentUser.id) getTopAlbumsForCurrentUser();

    async function getTopAlbumsForCurrentUser() {
      const result = await api.get();
      const topAlbums = [...result];
      dispatchMyTopAlbums({ type: INIT_TOP_ALBUMS, payload: topAlbums });
    }
  }, [api, currentUser.id]);

  const currentUserValue = React.useMemo(
    () => ({
      currentUser,
      api,
    }),
    [api, currentUser]
  );

  const browseAlbumsValue = React.useMemo(
    () => ({
      selectedOption,
      setSelectedOption,
      albums,
      dispatchAlbums,
      searchTerm,
      setSearchTerm,
      nextRequestRef,
      isAdding,
      setIsAdding,
    }),
    [albums, isAdding, searchTerm, selectedOption]
  );

  const myTopAlbumsValue = React.useMemo(
    () => ({
      myTopAlbums,
      isReorder,
      setIsReorder,
      isDeleting,
      setIsDeleting,
    }),
    [isDeleting, isReorder, myTopAlbums]
  );

  const myTopAlbumsDispatchValue = React.useMemo(
    () => ({
      dispatchMyTopAlbums,
    }),
    []
  );

  return (
    <BrowseAlbumsContext.Provider value={browseAlbumsValue}>
      <MyTopAlbumsContext.Provider value={myTopAlbumsValue}>
        <MyTopAlbumsDispatchContext.Provider value={myTopAlbumsDispatchValue}>
          <CurrentUserContext.Provider value={currentUserValue} {...props} />
        </MyTopAlbumsDispatchContext.Provider>
      </MyTopAlbumsContext.Provider>
    </BrowseAlbumsContext.Provider>
  );
}
