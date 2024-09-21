import { BTNode } from './node.mjs';

export class TreeNode extends BTNode{
    tasks = new Array();
    taskIndex = 0;
    constructor(tasks){
        super();
        if (Array.isArray(tasks)){
            this.tasks = tasks
        }
    }

    addTask(task) {
        this.tasks.push(task);
    }

    tick() {
        throw new TypeError("Do not call abstract method tick() from child.");
    }
}