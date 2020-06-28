import React from 'react';
import fetchSpotify from './fetchSpotify';
import useLocalStorage from './useLocalStorage';

export const BrowseAlbumsContext = React.createContext();
export const CurrentUserContext = React.createContext();
export const MyTopAlbumsContext = React.createContext();

export const INIT_ALBUMS = 'INIT_ALBUMS';
export const PUSH_ALBUMS = 'PUSH_ALBUMS';
export const CLEAR_ALBUMS = 'CLEAR_ALBUMS';
export const ADD_TOP_ALBUM = 'ADD_TOP_ALBUM';
export const BROWSE = 'Browse';
export const MY_TOP_10_ALBUMS = 'My Top 10 Albums';

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
    case ADD_TOP_ALBUM:
      return [...state, action.payload];
    default:
      return state;
  }
}

export function AppProvider(props) {
  const [currentUser, setCurrentUser] = React.useState();
  const [selectedOption, setSelectedOption] = React.useState(BROWSE);
  const [albums, dispatchAlbums] = React.useReducer(albumsReducer, []);
  const [myTopAlbums, dispatchMyTopAlbums] = React.useReducer(myTopAlbumsReducer, []);
  const [searchTerm, setSearchTerm] = React.useState('');
  const nextRequestRef = React.useRef(null);

  React.useEffect(() => {
    getCurrentUser();

    async function getCurrentUser() {
      const result = await fetchSpotify('https://api.spotify.com/v1/me');
      setCurrentUser(result);
    }
  }, []);

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
      dispatchMyTopAlbums,
    }),
    [myTopAlbums]
  );

  return (
    <BrowseAlbumsContext.Provider value={browseAlbumsValue}>
      <MyTopAlbumsContext.Provider value={myTopAlbumsValue}>
        <CurrentUserContext.Provider value={currentUserValue} {...props} />
      </MyTopAlbumsContext.Provider>
    </BrowseAlbumsContext.Provider>
  );
}
