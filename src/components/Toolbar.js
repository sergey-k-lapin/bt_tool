import { observer } from 'mobx-react-lite';
import React from 'react';
import { graphStore } from '../data/graphStore';
import { treeToCode } from '../tools/compiler';
import { editorStore } from '../data/editorStore';

const Toolbar = () => {
    const { nodes, edges, setNodes, setEdges } = graphStore;
    const { editor } = editorStore;

    if (!editor) return null;

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
        <div className="toolbar">

            <button onClick={(event) => { addNode('>'); }}>{'>'}</button>
            <button onClick={(event) => { addNode('?'); }}>?</button>
            <button onClick={(event) => { addNode('SL'); }}>SL</button>
            <button onClick={(event) => { addNode('RL'); }}>RL</button>
            <button onClick={(event) => { addNodeWithPrompt() }}>E</button>

            <button onClick={() => {
                localStorage.setItem('_nodesData', JSON.stringify(nodes));
                localStorage.setItem('_edgesData', JSON.stringify(edges));
                localStorage.setItem('_srcData', JSON.stringify(editor.getValue()));
            }}>Save</button>

            <button onClick={(event) => {
                const _src = treeToCode(nodes, edges, editor.getValue());
                editor.getModel().setValue(_src);
                editor.getAction('editor.action.formatDocument').run();
            }}>Code</button>

        </div>
    </>

}

export default observer(Toolbar);