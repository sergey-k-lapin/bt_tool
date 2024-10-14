import { BT_STATES } from '../types/types.mjs';
import { TreeNode } from './treeNode.mjs';

// Repeats its only child entity. By default, won’t repeat when the child entity fails. 
// This can be customized using the parameters below.

export class LoopNode extends TreeNode {
    tick() {
        do {
            this.state = this.tasks[0].tick();
            if (this.state == BT_STATES.RUNNING) {
                return BT_STATES.RUNNING
            }
            if (this.state == BT_STATES.PENDING) {
                return BT_STATES.PENDING
            }
            if (this.state == BT_STATES.FAILED) {
                return BT_STATES.FAILED
            }
        } while (true);
    }
}