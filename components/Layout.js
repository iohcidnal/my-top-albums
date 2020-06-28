import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Top Albums</title>
        <link rel="icon" href="/favicon.ico" />
        <script
          defer
          src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"
        />
      </Head>
      <section>
        <div>{children}</div>
      </section>
    </React.Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
