import React from 'react';

export default function useLocalStorage(key, initialItem) {
  /* eslint-disable no-undef */
  const getItem = React.useCallback(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialItem;
  }, [initialItem, key]);

  const setItem = React.useCallback(
    value => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return [getItem, setItem];
}
