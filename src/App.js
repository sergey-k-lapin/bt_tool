import './App.css';

import React, { useRef, useState } from 'react';
import { Canvas, Edge, Add, Node, upsertNode, useSelection, removeAndUpsertNodes } from 'reaflow';
import { treeToCode } from './tools/compiler';
import Editor from '@monaco-editor/react';

import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

loader.config({ monaco });

function App() {
  let nodesData = JSON.parse(localStorage.getItem('_nodesData'));
  let edgesData = JSON.parse(localStorage.getItem('_edgesData'));

  if (!nodesData) {
    nodesData = [];
    edgesData = [];
 }

  const [nodes, setNodes] = useState(nodesData);
  const [edges, setEdges] = useState(edgesData);

  console.log('Перерисовал шайнан.');

  const editorRef = useRef(null);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }
  const [src, setSrc] = useState('');

  const {
    selections,
    onCanvasClick,
    onClick,
    onKeyDown,
    clearSelections,
    setSelections
  } = useSelection({
    nodes,
    edges,
    onDataChange: (n, e) => {
      console.info('Data changed', n, e);
      setNodes(n);
      setEdges(e);
    },
    onSelection: s => {
      console.info('Selection', s);
    }
  });

  const [addHidden, setAddHidden] = useState(false);

  const getMaxId = ()=>{
    if (nodes.length === 0){
      return 1;
    }
    let result = parseInt(nodes[0].id);
    for(let node in nodes){
      let value = parseInt(nodes[node].id);
      if (value > result){
        result = value;
      }
    }
    return result;
  }
  const addNode = (name) =>{
    setNodes([...nodes, {
      id: getMaxId()+1,
      text: name
    }])
  }

  const addNodeWithPrompt = () =>{
    let name = window.prompt("Enter task name");
    if (name) {
      addNode(name);
    }
  }

  const Toolbar = () => {
    return (<>
      <div className="toolbar">
        <button onClick={(event) => {addNode('>');}}>{'>'}</button>
        <button onClick={(event) => {addNode('?');}}>?</button>
        <button onClick={(event) => {addNode('SL');}}>SL</button>
        <button onClick={(event) => {addNode('RL');}}>RL</button>
        <button onClick={(event) => {addNodeWithPrompt()}}>E</button>
        <button onClick={()=>{
          // console.log(JSON.stringify(nodes), JSON.stringify(edges));
          localStorage.setItem('_nodesData', JSON.stringify(nodes));
          localStorage.setItem('_edgesData', JSON.stringify(edges))
        }}>Save</button>
        <button onClick={ (event) => {
          const _src = treeToCode(nodes, edges);
          console.log(_src);
          // console.log( editorRef.current.getValue() );
          // setSrc(src);
          editorRef.current.getModel().setValue(_src);
          editorRef.current.getAction('editor.action.formatDocument').run();
        }}>Code</button>
      </div>
    </>)
  }

  return (
    <>
      <div className='diagram'>
        <Canvas
          nodes={nodes}
          edges={edges}
          selections={selections}

          onCanvasClick={event => {
            console.log('Canvas Clicked', event);
            if (addHidden){
              setAddHidden(false);
            }
            setSelections([]);
          }}

          onNodeLink={(_event, from, to) => {
            const id = `${from.id}-${to.id}`;
            setEdges([...edges, {
              id,
              from: from.id,
              to: to.id
            }]);
          }}

          edge={<Edge add={<Add hidden={addHidden} />} 
            onAdd={(event, edge) => {
                const id = `node-${Math.random()}`;
                const newNode = {
                  id,
                  text: id
                };
                const results = upsertNode(nodes, edges, edge, newNode);
                setNodes(results.nodes);
                setEdges(results.edges);
              }
            }
            onClick={(event, edge) => {
              console.log('Selecting Edge', event, edge);
              setAddHidden(true);
              setSelections([edge.id]);
            }}
            
            onRemove={(event, edge) => {
              console.log('Removing Edge', event, edge);
              setAddHidden(false);
              setEdges(edges.filter(e => e.id !== edge.id));
              setSelections([]);
            }}

          />}

          node={<Node dragCursor="grab" 
            onClick={(event, node) => {
              setAddHidden(true);
              // debugger
              if (!['?','>','RL','SL'].includes(node.text)){
                let newText = window.prompt('Set new value', node.text);
                if (newText){
                  let _node = nodes.find((n) => {return n.id === node.id});
                  _node.text = newText;
                  console.log(nodes);
                  setNodes([...nodes]);  
                }
              }
              onClick(event, node);
            }}
            
            onRemove={(event, node) => {
              const result = removeAndUpsertNodes(nodes, edges, node);
              setEdges(result.edges);
              setNodes(result.nodes);
              clearSelections();
            }} 
          
          />}

        />
      </div>
      <Toolbar />
      <div className="code-editor">
            <div><button>Open/close</button></div>
            <div>
                <Editor 
                  height="90vh"
                  defaultLanguage="javascript"
                  defaultValue={src}
                  // theme ={'vs-dark'}
                  onMount={handleEditorDidMount}
                  />
            </div>
        </div>

    </>
  );
}

export default App;
