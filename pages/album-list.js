import React from 'react';
import { BrowseArtists } from '../components';

const BROWSE = 'Browse';
const MY_TOP_ALBUMS = 'My Top Albums';

export default function AlbumList() {
  const [selectedTab, setSelectedTab] = React.useState(BROWSE);

  return (
    <React.Fragment>
      <div className="tabs is-centered is-medium">
        <ul>
          <li
            className={selectedTab === BROWSE ? 'is-active' : ''}
            onClick={() => setSelectedTab(BROWSE)}
          >
            <a>{BROWSE}</a>
          </li>
          <li
            className={selectedTab === MY_TOP_ALBUMS ? 'is-active' : ''}
            onClick={() => setSelectedTab(MY_TOP_ALBUMS)}
          >
            <a>{MY_TOP_ALBUMS}</a>
          </li>
        </ul>
      </div>
      {selectedTab === BROWSE && <BrowseArtists />}
      {selectedTab === MY_TOP_ALBUMS && (
        <div className="container">My Top Albums</div>
      )}
    </React.Fragment>
  );
}