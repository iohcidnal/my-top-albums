import React from 'react';
import { BrowseArtists, Layout, TopAlbumsProvider } from '../components';

const BROWSE = 'Browse';
const MY_TOP_10_ALBUMS = 'My Top 10 Albums';

export default function TopAlbums() {
  const [selectedOption, setSelectedOption] = React.useState(BROWSE);

  return (
    <TopAlbumsProvider>
      <Layout>
        <nav
          className="navbar is-fixed-top has-shadow"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-menu">
            <div className="navbar-start">
              <a
                className={`navbar-item ${
                  selectedOption === BROWSE
                    ? 'has-text-white has-background-link'
                    : ''
                }`}
                onClick={() => setSelectedOption(BROWSE)}
              >
                {BROWSE}
              </a>
              <a
                className={`navbar-item ${
                  selectedOption === MY_TOP_10_ALBUMS
                    ? 'has-text-white has-background-link'
                    : ''
                }`}
                onClick={() => setSelectedOption(MY_TOP_10_ALBUMS)}
              >
                {MY_TOP_10_ALBUMS}
              </a>
            </div>
          </div>
        </nav>
        <br />
        <div className="mt-6">
          {selectedOption === BROWSE && <BrowseArtists />}
          {selectedOption === MY_TOP_10_ALBUMS && (
            <div className="container">My Top Albums</div>
          )}
        </div>
      </Layout>
    </TopAlbumsProvider>
  );
}
