import React from 'react';
import { Layout, TopAlbumsProvider, Navigation } from '../components';

export default function TopAlbums() {
  return (
    <TopAlbumsProvider>
      <Layout>
        <Navigation />
      </Layout>
    </TopAlbumsProvider>
  );
}
