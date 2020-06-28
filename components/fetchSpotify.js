import fetch from 'node-fetch';

export default async function fetchSpotify(url) {
  const accessToken = localStorage.getItem('spotify-access-token');
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const fetchResult = await fetch(url, options);
  const jsonResult = await fetchResult.json();
  // TODO: handle expired token

  return jsonResult;
}
