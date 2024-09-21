import { BT_STATES } from '../types/types.mjs';
import { BTNode } from './node.mjs';

export class ExecutionNode extends BTNode {
    
    constructor(f, context){
        super();
        this.function = f;
        this.context = context;
    }
    tick() {
        return this.function.apply(this.context);
        // return this.function();
    }
}