import { BT_STATES } from '../types/types.mjs';
import { TreeNode } from './treeNode.mjs';


export class SuccessLoopNode extends TreeNode {    
    tick() {
        do{
            for (this.taskIndex; this.taskIndex < this.tasks.length; this.taskIndex++) {
                this.state = this.tasks[this.taskIndex].tick();
                if (this.state == BT_STATES.RUNING) {
                    return BT_STATES.RUNING
                }
                if (this.state == BT_STATES.FAILED) {
                    return BT_STATES.FAILED
                }
            }
            this.taskIndex = 0;
        } while(true)
    }
}