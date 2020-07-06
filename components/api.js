import fetch from 'node-fetch';
import Router from 'next/router';

export default function api(url) {
  return {
    get: async () => {
      let options;
      if (url.match(/spotify/i)) {
        const accessToken = localStorage.getItem('spotify-access-token');
        options = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
      }
      const jsonResult = await beginFetch(options);
      if (!jsonResult.hasOwnProperty('error')) {
        return jsonResult;
      } else {
        throw new Error(jsonResult.error.message);
      }
    },
    post: async payload => {
      const options = createOptions('POST', payload);
      return await beginFetch(options);
    },
    put: async payload => {
      const options = createOptions('PUT', payload);
      return await beginFetch(options);
    },
    delete: async id => {
      const options = createOptions('DELETE', { id });
      return await beginFetch(options);
    },
  };

  async function beginFetch(options) {
    const fetchResult = await fetch(url, options);
    return await fetchResult.json();
  }

  function createOptions(method, payload) {
    return {
      method,
      body: JSON.stringify(payload),
    };
  }
}
