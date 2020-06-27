import React from 'react';
import Head from 'next/head';

export default function Layout(props) {
  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <title>My Top Albums</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <div>{props.children}</div>
      </section>
    </React.Fragment>
  );
}
