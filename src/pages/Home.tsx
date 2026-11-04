import React from 'react';
import ColdOpen from '../sections/ColdOpen';
import Filename from '../sections/Filename';
import Slate from '../sections/Slate';
import Selects from '../sections/Selects';
import Range from '../sections/Range';
import Viewer from '../sections/Viewer';
import Credits from '../sections/Credits';
import PostCredits from '../sections/PostCredits';

export default function Home({ ready }: { ready: boolean }) {
  return (
    <main>
      <ColdOpen ready={ready} />
      <Filename />
      <Slate />
      <Selects />
      <Viewer />
      <Range />
      <Credits />
      <PostCredits />
    </main>
  );
}
