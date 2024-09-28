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

    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
            url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    return <>
        <div className="toolbar">

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

            <button onClick={() => {
                const project = JSON.stringify({
                    '_nodesData': nodes,
                    '_edgesData': edges,
                    '_srcData': editor.getValue()
                });
                download(project,'bt_project.json','application/json')
            }}>Export</button>

            <input type="file" onChange={(e)=>{
                  var file = e.target.files[0];
                  if (!file) {
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = function(e) {
                    const contents = JSON.parse(e.target.result);
                    editor.getModel().setValue(contents._srcData);
                    setNodes(contents._nodesData);
                    setEdges(contents._edgesData);
                  };
                  reader.readAsText(file);
            }}/>

        </div>
    </>

}

export default observer(Toolbar);