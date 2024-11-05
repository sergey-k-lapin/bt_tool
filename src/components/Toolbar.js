import { observer } from 'mobx-react-lite';
import React, { createElement, useState } from 'react';
import { graphStore } from '../data/graphStore';
import { treeToCode, normalize } from '../tools/compiler';
import { editorStore } from '../data/editorStore';
import { defaultSrc } from './Editor';
import { toPng } from 'html-to-image';

const Toolbar = () => {
    const { nodes, edges, setNodes, setEdges } = graphStore;
    const [open, setOpen] = useState(false);

    const { editor } = editorStore;

    if (!editor) return null;

    function download(data, filename, type) {
        var file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    function downloadImage(dataUrl, name) {
        const a = document.createElement('a');
      
        a.setAttribute('download', name);
        a.setAttribute('href', dataUrl);
        a.click();
      }

    // function makeSvg(svg) {
    //     let shadowSvg = svg.cloneNode(true);
        // function traverse(nodes, shadowNodes) {
        //     for (let index = 0; index < nodes.length; index++) {
        //         let node = nodes[index];
        //         let shadowNode = shadowNodes[index]
        //         if (node instanceof Element) {
        //             let className = node.getAttribute('class') || '';
        //             // if (className) {
        //                 let style = getComputedStyle(node);
        //                 const transform = style.transform;
        //                 if (transform != 'none'){
        //                     // debugger
        //                     const regex = /-?\d+(\.\d+)?/g;
        //                     const matrix = transform.match(regex);
        //                     shadowNode.style.transform = `translate(${matrix[4]}px,${matrix[5]}px)`;
        //                     console.log(matrix);
        //                     console.log(node.tagName, node.getAttribute('id'));
        //                 }

        //                 shadowNode.style.fill = className.indexOf('_path_') == -1 ? style.fill : 'none';
        //                 shadowNode.style.stroke = style.stroke;
        //                 shadowNode.style.strokeWidth = style.strokeWidth;
        //                 shadowNode.removeAttribute('class');
        //             // }
        //             if (node.childNodes && node.childNodes.length > 0) {
        //                 traverse(node.childNodes, shadowNode.childNodes);
        //             }
        //         } else {
        //             // debugger
        //             // console.log(node);
        //         }
        //     }
        // }
        // traverse(svg.childNodes, shadowSvg.childNodes);
    //     var serializer = new XMLSerializer();
    //     var source = serializer.serializeToString(shadowSvg);
    //     shadowSvg = undefined;

    //     //add name spaces.
    //     if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    //         source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    //     }
    //     if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    //         source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    //     }

    //     //add xml declaration
    //     source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    //     return source;
    // }

    const fileInput = React.createRef();
    let controls = null;
    if (open) {
        controls = <>
            <button title='Normalize tree'
                onClick={() => {
                    let newNode = [...nodes];
                    let newEdges = [...edges];
                    normalize(newNode, newEdges);
                    setNodes(newNode);
                    setEdges(newEdges);
                    setOpen(false);
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2m6 9h-5l1.81-1.81A3.94 3.94 0 0012 8a4 4 0 103.86 5h2.05A6 6 0 1112 6a5.91 5.91 0 014.22 1.78L18 6z" />
                </svg>
            </button>

            <button title='New'
                onClick={() => {
                    if (confirm('Clear all data?')) {
                        setNodes([]);
                        setEdges([]);
                        editor.getModel().setValue(defaultSrc);
                    }
                    setOpen(false);
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6zm8 7h-1V4l5 5h-4z" />
                </svg>
            </button>
            <button
                title='Save'
                onClick={() => {
                    localStorage.setItem('_nodesData', JSON.stringify(nodes));
                    localStorage.setItem('_edgesData', JSON.stringify(edges));
                    localStorage.setItem('_srcData', JSON.stringify(editor.getValue()));
                    setOpen(false);
                }}>
                <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path d="M893.3 293.3L730.7 130.7c-12-12-28.3-18.7-45.3-18.7H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 176h256v112H384V176zm128 554c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144zm0-224c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z" />
                </svg>
            </button>

            <button
                title='Export'
                onClick={() => {
                    const project = JSON.stringify({
                        '_nodesData': nodes,
                        '_edgesData': edges,
                        '_srcData': editor.getValue()
                    });
                    download(project, 'bt_project.json', 'application/json');
                    // setOpen( false );
                }}>
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6m-1 1.5L18.5 9H13m-4.07 3.22H16v7.07l-2.12-2.12L11.05 20l-2.83-2.83 2.83-2.82" />
                </svg>
            </button>

            <input type="file" style={{ 'display': 'none' }} ref={fileInput} onChange={(e) => {
                var file = e.target.files[0];
                if (!file) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = function (e) {
                    const contents = JSON.parse(e.target.result);
                    editor.getModel().setValue(contents._srcData);
                    normalize(contents._nodesData, contents._edgesData);
                    setNodes(contents._nodesData);
                    setEdges(contents._edgesData);
                    setOpen(false);
                };
                reader.readAsText(file);
            }} />
            <button
                title='Import'
                onClick={() => {
                    fileInput.current.click();
                }}>
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6m-1 1.5L18.5 9H13m-2.95 2.22l2.83 2.83L15 11.93V19H7.93l2.12-2.12-2.83-2.83" />
                </svg>
            </button>

            <button
                title='Build'
                onClick={(event) => {
                    const _src = treeToCode(nodes, edges, editor.getValue());
                    editor.getModel().setValue(_src);
                    editor.getAction('editor.action.formatDocument').run();
                    setOpen(false);
                }}>
                <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M17 8V2h3a1 1 0 011 1v4a1 1 0 01-1 1h-3zm-2 14a1 1 0 01-1 1h-4a1 1 0 01-1-1V8H2.5V6.074a1 1 0 01.496-.863L8.5 2H15v20z" />
                </svg>
            </button>

            <button
                title='Run'
                onClick={() => {
                    setOpen(false);
                    eval(editor.getValue());
                }}>
                <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm144.1 454.9L437.7 677.8a8.02 8.02 0 01-12.7-6.5V353.7a8 8 0 0112.7-6.5L656.1 506a7.9 7.9 0 010 12.9z" />
                </svg>
            </button>
            <button
                onClick={() => {
                    toPng(graphStore.svgRef,{
                        backgroundColor: '#FFFFFF'
                    }).then(function (dataUrl) {
                        downloadImage(dataUrl, 'behavior_tree.png');
                      });
                }}
            >
                PNG
            </button>
        </>
    }

    return <>
        <div className="toolbar">
            <button
                onClick={() => { setOpen(!open) }}
            >
                <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="2em"
                    width="2em"
                >
                    <path d="M865.3 244.7c-.3-.3-61.1 59.8-182.1 180.6l-84.9-84.9 180.9-180.9c-95.2-57.3-217.5-42.6-296.8 36.7A244.42 244.42 0 00419 432l1.8 6.7-283.5 283.4c-6.2 6.2-6.2 16.4 0 22.6l141.4 141.4c6.2 6.2 16.4 6.2 22.6 0l283.3-283.3 6.7 1.8c83.7 22.3 173.6-.9 236-63.3 79.4-79.3 94.1-201.6 38-296.6z" />
                </svg>
            </button>
            {controls}
        </div>
    </>

}

export default observer(Toolbar);

//TODO:
// const action = myEditor?.getAction("actions.find");
// const model = myEditor.getModel();
// const range = model.findMatches('hello')[0].range;

// myEditor.setSelection(range);
// myEditor.getAction('actions.find').run();