import React from 'react';

import { BROWSE, MY_TOP_10_ALBUMS, BrowseAlbumsContext, CurrentUserContext } from './AppProvider';
import BrowseAlbums from './BrowseAlbums';
import MyTopAlbums from './MyTopAlbums';

export default function Navigation() {
  const { currentUser } = React.useContext(CurrentUserContext);
  const { selectedOption, setSelectedOption } = React.useContext(BrowseAlbumsContext);

  return (
    <React.Fragment>
      <nav
        className="navbar is-fixed-top has-shadow has-background-light"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-menu">
          <div className="navbar-start">
            <a
              className={`navbar-item ${selectedOption === BROWSE ? 'has-text-white has-background-link' : ''}`}
              onClick={() => setSelectedOption(BROWSE)}
            >
              {BROWSE}
            </a>
            <a
              className={`navbar-item ${
                selectedOption === MY_TOP_10_ALBUMS ? 'has-text-white has-background-link' : ''
              }`}
              onClick={() => setSelectedOption(MY_TOP_10_ALBUMS)}
            >
              {MY_TOP_10_ALBUMS}
            </a>
          </div>
          <div className="navbar-end">
            <div className="navbar-item ">{currentUser?.display_name}</div>
          </div>
        </div>
      </nav>
      <br />
      <div className="mt-6">
        {selectedOption === BROWSE && <BrowseAlbums />}
        {selectedOption === MY_TOP_10_ALBUMS && <MyTopAlbums />}
      </div>
    </React.Fragment>
  );
}
