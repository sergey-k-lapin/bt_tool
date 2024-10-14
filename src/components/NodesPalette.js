import React from 'react';
import { observer } from 'mobx-react-lite';
import { toolbarStore } from '../data/toolbarStore';
import { graphStore } from '../data/graphStore';

export const NodesPalette = () => {
    const { nodes, edges, setNodes, setEdges } = graphStore;

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
    
    const addNode = (name) => {
        setNodes([...nodes, {
            id: getMaxId() + 1,
            text: name
        }])
    }
    
    const addNodeWithPrompt = () => {
        let name = window.prompt("Enter task name");
        if (name) {
            addNode(name);
        }
    }
        
return <>
        <div className='nodes-palette'>
            <button title="Sequence node"
                onClick={(event) => { addNode('>'); }}>{'>'}
            </button>
            <button title="Selector node"
                onClick={(event) => { addNode('?'); }}>?</button>
            <button title="Success loop"
                onClick={(event) => { addNode('SL'); }}>SL</button>
            <button title="Running loop"
                onClick={(event) => { addNode('RL'); }}>RL</button>
            <button title="Reset sequence"
                onClick={(event) => { addNode('R'); }}>R</button>
            <button title="Task execution"
                onClick={(event) => { addNodeWithPrompt() }}>E</button>
            <button title="Loop - Repeats its only child entity. By default, won’t repeat when the child entity fails. This can be customized using the parameters below."
                onClick={(event) => { addNode('L'); }}>L</button>
        </div>
    </>
}

export default observer(NodesPalette);