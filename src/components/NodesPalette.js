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
            <button title="Sequence node - выполняет каждую дочернюю ноду пока возвражается SUCCESS, в противном случае возвращает текущий статус."
                onClick={(event) => { addNode('>'); }}>{'>'}
            </button>
            <button title="Selector node - выполняет каждую ноду пока возвращается FALSE, в противном случае возвращается с текущим статусом."
                onClick={(event) => { addNode('?'); }}>?</button>
            <button onClick={(event) => { addNode('SL'); }}>SL</button>
            <button title="Success loop - циклически выполняет дочерние ноды пока возвражается RUNNING"
                onClick={(event) => { addNode('RL'); }}>RL</button>
            <button title="Success loop - циклически выполняет дочерние ноды пока возвражается RUNNING"
                onClick={(event) => { addNode('R'); }}>R</button>
            <button title="Reset sequence - resterts children iteration when receive RUNNING, in other cases ats as sequence node."
                onClick={(event) => { addNodeWithPrompt() }}>E</button>
        </div>
    </>
}

export default observer(NodesPalette);