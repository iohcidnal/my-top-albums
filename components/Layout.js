import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ToastContainer, Slide } from 'react-toastify';

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Top Albums</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </Head>
      <section>
        <div>{children}</div>
        <ToastContainer transition={Slide} hideProgressBar />
      </section>
    </React.Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
