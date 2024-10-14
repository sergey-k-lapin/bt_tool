import React, { useRef } from 'react';
import { editorStore } from '../data/editorStore';

import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';

loader.config({ monaco });

export const defaultSrc = 'const {BT_STATES, LoopNode, SuccessLoopNode, SequenceNode, ResetSequenceNode, SelectorNode, RunningLoopNode, ExecutionNode} = bt;\n\
class MyTree {\n\
//FUNC BEGIN\n\
//FUNC END\n\
//TREE BEGIN\n\
//TREE END\n\
}\n\
const behaviorTree = new MyTree();\n\
console.log(behaviorTree);\n';

export const CodeEditor = () => {
    let src = JSON.parse(localStorage.getItem('_srcData'));
    if (!src) {
        src = defaultSrc;
    }

    const editorRef = useRef(null);
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
        editorRef.current.getModel().setValue(src)
        editorStore.setEditor(editor);
    }

    return <>
        <div className="code-editor">
            <div>
                <Editor
                    height="99vh"
                    defaultLanguage="javascript"
                    defaultValue={src}
                    // theme ={'vs-dark'}
                    onMount={handleEditorDidMount}
                />
            </div>
        </div>
    </>
}

export default CodeEditor;