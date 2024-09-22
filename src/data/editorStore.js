import { makeObservable, observable, action } from 'mobx';

export class EditorStore {
    constructor(){
        makeObservable(this, {
            src: observable,
            editor: observable,
            setSrc: action,
            setEditor: action,
        });
    }

    src = '';
    editor = undefined;

    setSrc = (_src)=>{
        this.src = _src;
    }
    setEditor = (_ref)=>{
        this.editor = _ref;
    }
};

export const editorStore = new EditorStore();