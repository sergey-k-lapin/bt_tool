import './App.css';

import React, { useRef, useState } from 'react';
import { graphStore } from './data/graphStore';

import TreeSVG from './components/TreeSVG';
import Toolbar from './components/Toolbar';
import DiagramSettings from './components/DiagramSettings';
import CodeEditor from './components/Editor';

function App() {
  let nodesData = JSON.parse(localStorage.getItem('_nodesData'));
  let edgesData = JSON.parse(localStorage.getItem('_edgesData'));

  if (!nodesData) {
    nodesData = [];
    edgesData = [];
  }

  graphStore.setNodes(nodesData);
  graphStore.setEdges(edgesData);

  console.log('Перерисовал шайнан.');

  return (
    <>
      <TreeSVG />
      <Toolbar />
      <DiagramSettings />
      <CodeEditor />
    </>
  );
}

export default App;
