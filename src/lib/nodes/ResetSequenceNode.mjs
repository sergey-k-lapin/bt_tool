import { BT_STATES } from '../types/types.mjs';
import { TreeNode } from './treeNode.mjs';

export class ResetSequenceNode extends TreeNode {
    tick() {
        for (this.taskIndex; this.taskIndex < this.tasks.length; this.taskIndex++) {
            this.state = this.tasks[this.taskIndex].tick();
            if (this.state == BT_STATES.RUNNING) {
                this.taskIndex = 0;
                return BT_STATES.RUNNING
            }
            if (this.state == BT_STATES.FAILED) {
                return BT_STATES.FAILED
            }
            if (this.state == BT_STATES.PENDING) {
                return BT_STATES.PENDING
            }
        }
        this.taskIndex = 0;
        return BT_STATES.SUCCESS;
    }
}