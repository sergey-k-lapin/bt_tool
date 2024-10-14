import React, { useEffect, useState, createRef } from 'react';
import { Canvas, Edge, Add, Node, upsertNode, useSelection, removeAndUpsertNodes, hasLink, createEdgeFromNodes } from 'reaflow';
import { graphStore } from '../data/graphStore';
import { observer } from 'mobx-react-lite';
import { toolbarStore } from '../data/toolbarStore';
import { editorStore } from '../data/editorStore';


const TreeSVG = (props) => {
    const [addHidden, setAddHidden] = useState(false);
    const { nodes, edges, setNodes, setEdges } = graphStore;
    const dragType = toolbarStore.dragType;
    const panType = toolbarStore.panType;

    const canvasRef = createRef();
    useEffect(() => {
        graphStore.svgRef = canvasRef.current.svgRef.current;
    }, [])

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
            setNodes(n);
            setEdges(e);
        },
        onSelection: s => {
        }
    });

    const getMaxId = () => {
        if (nodes.length === 0) {
            return 1;
        }
        let result = parseInt(nodes[0].id);
        for (let node in nodes) {
            let value = parseInt(nodes[node].id);
            if (value > result) {
                result = value;
            }
        }
        return result;
    }

    return <>
        <div className='diagram'>
            <Canvas
                ref={canvasRef}
                panType={panType}
                nodes={nodes}
                edges={edges}
                selections={selections}

                onCanvasClick={event => {
                    if (addHidden) {
                        setAddHidden(false);
                    }
                    setSelections([]);
                }}
                onNodeLinkCheck={(_event, from, to) => {
                    if (from.id === to.id) {
                        return false;
                    }
                    if (hasLink(edges, from, to)) {
                        return false;
                    }
                    return true;
                }}

                onNodeLink={(_event, from, to) => {
                    if (dragType == 'node') {
                        const newEdges = edges.filter(e => e.to !== from.id);
                        setEdges([...newEdges, createEdgeFromNodes(to, from)]);
                    } else {
                        setEdges([...edges, createEdgeFromNodes(from, to)]);
                    }
                }}

                edge={<Edge add={<Add hidden={addHidden} />}
                    onAdd={(event, edge) => {
                        const id = getMaxId()+1;
                        const newNode = {
                            id,
                            text: 'Node id:'+id
                        };
                        const results = upsertNode(nodes, edges, edge, newNode);
                        setNodes(results.nodes);
                        setEdges(results.edges);
                    }

                    }
                    onClick={(event, edge) => {
                        setAddHidden(true);
                        setSelections([edge.id]);
                    }}

                    onRemove={(event, edge) => {
                        setAddHidden(false);
                        setEdges(edges.filter(e => e.id !== edge.id));
                        setSelections([]);
                    }}

                />}

                node={<Node dragCursor="grab" dragType={dragType}
                    onClick={(event, node) => {
                        if (event.altKey) {
                            setAddHidden(true);
                            // if (!['?', '>', 'RL', 'SL'].includes(node.text)) {
                            let newText = window.prompt('Set new value', node.text);
                            if (newText) {
                                let _node = nodes.find((n) => { return n.id === node.id });
                                _node.text = newText;
                                setNodes([...nodes]);
                            }
                            // }
                            onClick(event, node);
                        } else {
                            if (!['?', '>', 'RL', 'SL', 'R'].includes(node.text)) {
                                editorStore.findText(node.text);
                            }
                        }
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