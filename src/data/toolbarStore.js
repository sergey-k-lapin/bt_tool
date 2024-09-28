import { makeObservable, observable, action } from 'mobx';

export class ToolbarStore {
    constructor(){
        makeObservable(this, {
            dragType: observable,
            panType: observable,
            setDragType: action,
            setPanType: action
        });
    }

    dragType = undefined;
    panType = 'scroll';

    setDragType = (type) => {
        this.dragType = type;
    }

    setPanType = (type) => {
        this.panType = type;
    }
};

export const toolbarStore = new ToolbarStore();