import React from 'react';
import fetchSpotify from './fetchSpotify';

export const TopAlbumsContext = React.createContext();
export const CurrentUserContext = React.createContext();

export const INIT_ALBUMS = 'INIT_ALBUMS';
export const PUSH_ALBUMS = 'PUSH_ALBUMS';
export const CLEAR_ALBUMS = 'CLEAR_ALBUMS';
export const BROWSE = 'Browse';
export const MY_TOP_10_ALBUMS = 'My Top 10 Albums';

function reducers(state, action) {
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

export function TopAlbumsProvider(props) {
  const [currentUser, setCurrentUser] = React.useState();
  const [selectedOption, setSelectedOption] = React.useState(BROWSE);
  const [albums, dispatchAlbums] = React.useReducer(reducers, []);
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

  const topAlbumsValue = React.useMemo(
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

  return (
    <TopAlbumsContext.Provider value={topAlbumsValue}>
      <CurrentUserContext.Provider value={currentUserValue} {...props} />
    </TopAlbumsContext.Provider>
  );
}
