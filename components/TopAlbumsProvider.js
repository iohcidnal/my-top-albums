import React from 'react';

export const TopAlbumsContext = React.createContext();
export const INIT_ALBUMS = 'INIT_ALBUMS';
export const PUSH_ALBUMS = 'PUSH_ALBUMS';
export const CLEAR_ALBUMS = 'CLEAR_ALBUMS';

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
  const [albums, dispatchAlbums] = React.useReducer(reducers, []);

  const topAlbumsValue = React.useMemo(
    () => ({
      albums,
      dispatchAlbums,
    }),
    [albums]
  );

  return <TopAlbumsContext.Provider value={topAlbumsValue} {...props} />;
}
