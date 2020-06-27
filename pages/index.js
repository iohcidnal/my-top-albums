import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import Layout from '../components/Layout';

const scopes =
  'user-read-private+user-read-email+playlist-read-private+user-top-read+user-read-recently-played';
const redirectUri = 'http://localhost:3000';
const clientId = 'your-client-id';
const spotifyAuthUrl = `https://accounts.spotify.com/authorize/?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;

export default function Home() {
  const [accessToken, setAccessToken] = React.useState();

  React.useEffect(() => {
    const url = window.location.href;
    if (url.indexOf('_token') > -1) {
      const accessToken = url.split('_token=')[1].split('&')[0].trim();
      setAccessToken(accessToken);
    }
  }, []);

  React.useEffect(() => {
    if (accessToken) {
      localStorage.setItem('spotify-access-token', accessToken);
      Router.push({
        pathname: '/album-list',
      });
    }
  }, [accessToken]);

  function handleLogin(event) {
    event.preventDefault();
    document.location = spotifyAuthUrl;
  }

  return (
    <Layout>
      <div className="pt-6">
        <div className="is-size-1 has-text-centered has-text-weight-semibold">
          Welcome to My Top 10 Albums
        </div>
        <div className="is-size-6 has-text-centered">
          A simple application that lets you pick your top 10 albums of all
          time.
        </div>
        <br />
        <div className="is-size-5 has-text-centered ">
          Get started by loging into{' '}
          <a href="/" onClick={handleLogin}>
            Spotify
          </a>
        </div>
      </div>
    </Layout>
  );
}
