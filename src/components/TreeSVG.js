import React, { useEffect, useState } from 'react';
import { Canvas, Edge, Add, Node, upsertNode, useSelection, removeAndUpsertNodes } from 'reaflow';
import { graphStore } from '../data/graphStore';
import { observer } from 'mobx-react-lite';



const TreeSVG = (props) => {
    const [addHidden, setAddHidden] = useState(false);
    const {nodes, edges, setNodes, setEdges} = graphStore;

    useEffect(()=>{}, [])
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
        //   console.info('Data changed', n, e);
          setNodes(n);
          setEdges(e);
        },
        onSelection: s => {
        //   console.info('Selection', s);
        }
      });
    

    return <>
        <div className='diagram'>
            <Canvas
                nodes={nodes}
                edges={edges}
                selections={selections}

                onCanvasClick={event => {
                    // console.log('Canvas Clicked', event);
                    if (addHidden) {
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
                        // if (!['?', '>', 'RL', 'SL'].includes(node.text)) {
                            let newText = window.prompt('Set new value', node.text);
                            if (newText) {
                                let _node = nodes.find((n) => { return n.id === node.id });
                                _node.text = newText;
                                // console.log(nodes);
                                setNodes([...nodes]);
                            }
                        // }
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
    </>
}

export default observer(TreeSVG);