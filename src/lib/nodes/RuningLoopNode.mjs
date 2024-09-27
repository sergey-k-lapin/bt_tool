import { BT_STATES } from '../types/types.mjs';
import { TreeNode } from './treeNode.mjs';


export class RunningLoopNode extends TreeNode {    
    tick() {
        do{
            for (this.taskIndex; this.taskIndex < this.tasks.length; this.taskIndex++) {
                this.state = this.tasks[this.taskIndex].tick();
                if (this.state == BT_STATES.SUCCESS) {
                    return BT_STATES.SUCCESS
                }
                if (this.state == BT_STATES.FAILED) {
                    return BT_STATES.FAILED
                }
                if (this.state == BT_STATES.PENDING) {
                    return BT_STATES.PENDING
                }
            }
            this.taskIndex = 0;
        } while(true)
    }
}