import React from 'react';
import { Layout, AppProvider, Navigation } from '../components';

export default function TopAlbums() {
  return (
    <AppProvider>
      <Layout>
        <Navigation />
      </Layout>
    </AppProvider>
  );
}
