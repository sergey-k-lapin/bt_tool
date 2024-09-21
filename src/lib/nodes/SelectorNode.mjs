import { BT_STATES } from '../types/types.mjs';
import { TreeNode } from './treeNode.mjs';

export class SelectorNode extends TreeNode {
    tick() {
        for (this.taskIndex; this.taskIndex < this.tasks.length; this.taskIndex++){
            this.state = this.tasks[this.taskIndex].tick();
            if (this.state == BT_STATES.RUNING) {
                return BT_STATES.RUNING
            }
            if (this.state == BT_STATES.SUCCESS) {
                return BT_STATES.SUCCESS
            }
        }
        return BT_STATES.FAILED;
    }
}