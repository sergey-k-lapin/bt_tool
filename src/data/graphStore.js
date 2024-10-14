import { makeObservable, observable, action } from 'mobx';
import { createRef } from 'react';

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

    svgRef;

    setNodes = (_nodes) => {
        this.nodes = _nodes;
    }

    setEdges = (_edges) => {
        this.edges = _edges;
    }
}

export const graphStore = new GraphStore();
