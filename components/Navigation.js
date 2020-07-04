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

const selectedClassname = 'has-text-white has-background-link has-text-weight-semibold';

export default function Navigation() {
  const { currentUser } = React.useContext(CurrentUserContext);
  const { selectedOption, setSelectedOption } = React.useContext(BrowseAlbumsContext);
  const { myTopAlbums, setIsReorder } = React.useContext(MyTopAlbumsContext);
  const [isGridDisplay, setIsGridDisplay] = React.useState(true);
  const [isBurgerClicked, setIsBurgerClicked] = React.useState(false);

  function handleOptionClick(option) {
    setIsBurgerClicked(false);
    setSelectedOption(option);
  }

  function handleGridDisplayClick(value) {
    setIsBurgerClicked(false);
    setIsGridDisplay(value);
  }

  function handleReorderClick() {
    setIsBurgerClicked(false);
    setIsReorder(true);
  }

  return (
    <React.Fragment>
      <nav
        className="navbar is-fixed-top has-shadow has-background-light"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <span className="navbar-item material-icons">graphic_eq</span>
          <a
            onClick={() => setIsBurgerClicked(true)}
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarOptions"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        </div>
        <div id="navbarOptions" className={`navbar-menu ${isBurgerClicked ? 'is-active' : ''}`}>
          <div className="navbar-start">
            <a
              className={`navbar-item ${selectedOption === BROWSE ? selectedClassname : ''}`}
              onClick={() => handleOptionClick(BROWSE)}
            >
              {BROWSE}
            </a>
            <a
              className={`navbar-item ${
                selectedOption === MY_TOP_10_ALBUMS ? selectedClassname : ''
              }`}
              onClick={() => handleOptionClick(MY_TOP_10_ALBUMS)}
            >
              <span
                title="Badge Top Albums Count"
                className={`badge is-dark is-right ${isBurgerClicked ? 'mr-3' : ''}`}
              >
                {myTopAlbums.length}
              </span>
              {MY_TOP_10_ALBUMS}
            </a>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              {isGridDisplay && (
                <button
                  className="button"
                  title="Display result as list"
                  onClick={() => handleGridDisplayClick(false)}
                >
                  <span className="icon">
                    <i className="material-icons">list</i>
                  </span>
                </button>
              )}
              {!isGridDisplay && (
                <button
                  className="button"
                  title="Display result as grid"
                  onClick={() => handleGridDisplayClick(true)}
                >
                  <span className="icon">
                    <i className="material-icons">grid_on</i>
                  </span>
                </button>
              )}
            </div>
            {selectedOption === MY_TOP_10_ALBUMS && myTopAlbums.length > 1 && (
              <div className="navbar-item">
                <button className="button" title="Reorder top albums" onClick={handleReorderClick}>
                  <span className="icon">
                    <i className="material-icons">format_list_numbered</i>
                  </span>
                </button>
              </div>
            )}
            <div className="navbar-item ">
              <span className="material-icons">person</span>
              {currentUser?.display_name}
            </div>
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
