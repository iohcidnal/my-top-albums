import 'bulma/css/bulma.css';
import '@creativebulma/bulma-badge/dist/bulma-badge.css';
import 'react-toastify/dist/ReactToastify.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
