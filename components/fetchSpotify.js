import fetch from 'node-fetch';
import Router from 'next/router';

export default async function fetchSpotify(url) {
  const accessToken = localStorage.getItem('spotify-access-token');
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const fetchResult = await fetch(url, options);
  const jsonResult = await fetchResult.json();

  if (!jsonResult.hasOwnProperty('error')) {
    return jsonResult;
  } else {
    throw new Error(jsonResult.error.message);
  }
}
