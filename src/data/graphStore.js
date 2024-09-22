import { makeObservable, observable, action } from 'mobx';

export class GraphStore {
    constructor(){
        makeObservable(this, {
            nodes: observable,
            edges: observable,
            setNodes: action,
            setEdges: action,
        });
    }

    nodes = [];
    edges = [];

    setNodes = (_nodes) => {
        this.nodes = _nodes;
    }

    setEdges = (_edges) => {
        this.edges = _edges;
    }
}

export const graphStore = new GraphStore();
