import { BT_STATES } from '../types/types.mjs';
import { TreeNode } from './treeNode.mjs';

export class SelectorNode extends TreeNode {
    tick() {
        for (this.taskIndex; this.taskIndex < this.tasks.length; this.taskIndex++){
            this.state = this.tasks[this.taskIndex].tick();
            if (this.state == BT_STATES.PENDING) {
                return BT_STATES.PENDING
            }
            // if (this.state == BT_STATES.RUNNING) {
            //     return BT_STATES.RUNNING
            // }
            // if (this.state == BT_STATES.SUCCESS) {
            //     return BT_STATES.SUCCESS
            // }
            if (this.state != BT_STATES.FAILED){
                this.taskIndex = 0;
                return this.state;
            }
        }
        this.taskIndex = 0;
        return BT_STATES.FAILED;
    }
}