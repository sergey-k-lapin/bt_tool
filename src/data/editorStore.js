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

    findText(text){
        const model = this.editor.getModel();
        const match = model.findMatches(text)[0];
        if (match?.range){
            this.editor.setSelection(match.range);
            this.editor.revealRangeInCenter(match.range);
            this.editor.getAction('actions.findWithSelection').run();
        }
    }
};

export const editorStore = new EditorStore();