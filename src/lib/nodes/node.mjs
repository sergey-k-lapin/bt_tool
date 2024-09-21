import { BT_STATES } from '../types/types.mjs';

export class BTNode {
    state = BT_STATES.FAILED;
    
    tick() {
        throw new TypeError("Do not call abstract method tick() from child.");
    }
}