import React from 'react';
import fetchSpotify from './fetchSpotify';
import useLocalStorage from './useLocalStorage';

export const BrowseAlbumsContext = React.createContext();
export const CurrentUserContext = React.createContext();
export const MyTopAlbumsContext = React.createContext();
export const MyTopAlbumsDispatchContext = React.createContext();

export const INIT_ALBUMS = 'INIT_ALBUMS';
export const PUSH_ALBUMS = 'PUSH_ALBUMS';
export const CLEAR_ALBUMS = 'CLEAR_ALBUMS';

const INIT_TOP_ALBUMS = 'INIT_TOP_ALBUMS';
export const PUSH_TOP_ALBUM = 'PUSH_TOP_ALBUM';
export const DELETE_TOP_ALBUM = 'DELETE_TOP_ALBUM';

export const BROWSE = 'Browse';
export const MY_TOP_10_ALBUMS = 'My Top 10 Albums';

const initCurrentUser = { id: null };
/**
  topAlbum shape stored in local storage:
    {
      user-id-1: [album object, album object, album object, ...],
      user-id-2: [album object, album object, album object, ...]
    }
 */
const initTopAlbum = {};

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
  const [myTopAlbums, dispatchMyTopAlbums] = React.useReducer(myTopAlbumsReducer, []);
  const [searchTerm, setSearchTerm] = React.useState('');
  const nextRequestRef = React.useRef();
  const [getTopAlbumFromStorage, setTopAlbumInStorage] = useLocalStorage(
    'top-albums',
    initTopAlbum
  );

  React.useEffect(() => {
    getCurrentUser();

    async function getCurrentUser() {
      const result = await fetchSpotify('https://api.spotify.com/v1/me');
      setCurrentUser(result);
    }
  }, []);

  React.useEffect(() => {
    if (currentUser.id) getTopAlbumsForCurrentUser();

    function getTopAlbumsForCurrentUser() {
      const topAlbum = getTopAlbumFromStorage();
      const topAlbums = [...(topAlbum[currentUser.id] || [])];
      dispatchMyTopAlbums({ type: INIT_TOP_ALBUMS, payload: topAlbums });
    }
  }, [currentUser.id, getTopAlbumFromStorage]);

  React.useEffect(() => {
    if (currentUser.id) {
      const topAlbum = getTopAlbumFromStorage();
      setTopAlbumInStorage({ ...topAlbum, [currentUser.id]: myTopAlbums });
    }
  }, [currentUser.id, getTopAlbumFromStorage, myTopAlbums, setTopAlbumInStorage]);

  const currentUserValue = React.useMemo(
    () => ({
      currentUser,
    }),
    [currentUser]
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
    }),
    [albums, searchTerm, selectedOption]
  );

  const myTopAlbumsValue = React.useMemo(
    () => ({
      myTopAlbums,
    }),
    [myTopAlbums]
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
