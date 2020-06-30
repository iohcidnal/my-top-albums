import React from 'react';

import {
  BROWSE,
  MY_TOP_10_ALBUMS,
  BrowseAlbumsContext,
  CurrentUserContext,
  MyTopAlbumsContext,
} from './AppProvider';
import BrowseAlbums from './BrowseAlbums';
import MyTopAlbums from './MyTopAlbums';

export default function Navigation() {
  const { currentUser } = React.useContext(CurrentUserContext);
  const { selectedOption, setSelectedOption } = React.useContext(BrowseAlbumsContext);
  const { setIsReorder } = React.useContext(MyTopAlbumsContext);
  const [isGridDisplay, setIsGridDisplay] = React.useState(true);

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
              className={`navbar-item ${
                selectedOption === BROWSE ? 'has-text-white has-background-link' : ''
              }`}
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
            <div className="navbar-item">
              {isGridDisplay && (
                <button
                  className="button is-primary"
                  title="Display result as list"
                  onClick={() => setIsGridDisplay(false)}
                >
                  <span className="icon">
                    <i className="fas fa-list-ul" />
                  </span>
                </button>
              )}
              {!isGridDisplay && (
                <button
                  className="button is-primary"
                  title="Display result as grid"
                  onClick={() => setIsGridDisplay(true)}
                >
                  <span className="icon">
                    <i className="fas fa-th" />
                  </span>
                </button>
              )}
            </div>
            {selectedOption === MY_TOP_10_ALBUMS && (
              <div className="navbar-item">
                <button
                  className="button is-primary"
                  title="Reorder top albums"
                  onClick={() => setIsReorder(true)}
                >
                  <span className="icon">
                    <i className="fas fa-sort-numeric-up" />
                  </span>
                </button>
              </div>
            )}
            <div className="navbar-item ">{currentUser?.display_name}</div>
          </div>
        </div>
      </nav>
      <br />
      <div className="mt-6">
        {selectedOption === BROWSE && <BrowseAlbums isGridDisplay={isGridDisplay} />}
        {selectedOption === MY_TOP_10_ALBUMS && <MyTopAlbums isGridDisplay={isGridDisplay} />}
      </div>
    </React.Fragment>
  );
}
