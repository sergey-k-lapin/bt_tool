import './App.css';

import React, { useRef, createRef } from 'react';
import { graphStore } from './data/graphStore';

import TreeSVG from './components/TreeSVG';
import Toolbar from './components/Toolbar';
import NodesPalette from './components/NodesPalette';
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

  const panels = useRef({
    left: {
      element: createRef(),
      size: 50,
    },
    right: {
      element: createRef(),
      size: 50,
    }
  });

  const m = useRef({
    x:0,
    y:0,
  });

  const percentsPerPixel = useRef(0);

  function size2css(size) {
    return `calc(${size}% - 5px)`;
  }
  
  function changePanelSize(size, panel) {
    panel.element.current.style.width = size2css(size);
  }
  
  function changePanels(delta){
    panels.current.left.size -= delta*percentsPerPixel.current;
    panels.current.right.size += delta*percentsPerPixel.current;
    changePanelSize(panels.current.left.size, panels.current.left);
    changePanelSize(panels.current.right.size, panels.current.right);
  }


  console.log('Перерисовал шайнан.');

  const onMouseMove = (e) => {
      changePanels(m.current.x - e.clientX);
      m.current.x = e.clientX;
      m.current.y = e.clientY;
  }


  return (
    <>
      <div className='splitter'>
        <div className='panel' style={{ width: size2css(panels.current.left.size) }} ref={panels.current.left.element}>
          <TreeSVG />
        </div>
        <div className='gutter'
          onMouseDown={(e) => {
            percentsPerPixel.current = 100.0 / e.target.parentNode.clientWidth;
            m.current.x = e.clientX;
            m.current.y = e.clientY;
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', () =>{
              window.removeEventListener('mousemove', onMouseMove);
            }, {once: true});
          }}
        ></div>
        <div className='panel' style={{ width: size2css(panels.current.right.size) }} ref={panels.current.right.element}>
          <CodeEditor />
        </div>
      </div>

      <Toolbar />
      <DiagramSettings />
      <NodesPalette />
    </>
  );
}

export default App;
