import React from 'react';
import useDebounce from './useDebounce';
import fetch from 'node-fetch';

export const spotifySearchURL = 'https://api.spotify.com/v1/search?q=';

export default function BrowseAlbums() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [albums, setAlbums] = React.useState([]);

  React.useEffect(() => {
    if (!debouncedSearchTerm) return;
    searchAlbum();

    async function searchAlbum() {
      const accessToken = localStorage.getItem('spotify-access-token');
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const fetchResult = await fetch(
        `${spotifySearchURL}${debouncedSearchTerm}&type=album&market=US&limit=10&offset=5`,
        options
      );
      const jsonResult = await fetchResult.json();
      console.log('jsonResult', jsonResult);
      setAlbums(jsonResult.albums.items);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="container">
      <div className="field">
        <div className="control">
          <input
            className="input is-medium"
            type="text"
            placeholder="Search album"
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
      <br />
      <div className="columns is-multiline is-mobile">
        {albums.map(a => (
          <div key={a.id} className="column is-one-quarter card">
            <div className="card-image">
              <figure>
                <img src={a.images[1].url} alt="Placeholder image"></img>
              </figure>
            </div>
            <div className="card-content">
              <div className="media-content">
                <p className="title is-4">{a.name}</p>
                <p className="subtitle is-6">{a.artists[0].name}</p>
              </div>
            </div>
          </div>
        ))}
        {/* STOPHERE: Add 'load more...' */}
      </div>
    </div>
  );
}
