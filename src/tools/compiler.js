export function treeToCode(nodes, edges, src='') {
    //find roots
    const roots = [];
    for(let n in nodes) {
        let node = nodes[n];
        let root = edges.find( (edge) => { return edge.to == node.id})
        if (!root){
            roots.push(node);
        }
    }
    function getChildNodes(node){
        let childEdges = edges.filter( (child) => {return child.from === node.id});
        return childEdges.map( (edge) => { return nodes.find( (node) => {return node.id === edge.to})});
    }
    let functions = [];

    function nodeToCode(node) {
        switch(node.text){
            case 'RL':{
                return `new RunningLoopNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            }
            case 'SL':{
                return `new SuccessLoopNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            }
            case '?':
                return `new SelectionNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            case '>':
                return `new SequenceNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            default:
                //Exevution node
                functions.push(node.text);
                return 'new ExecutionNode('+node.text+')';
        }
    }
    console.log(roots);

    let root = roots[0];
    let tree = '//TREE BEGIN\ntree = ' + nodeToCode(root)+'\n//TREE END\n';
    let func = functions.map( (f) => {
        return `${f}(){\n//CODE BEDIN\n//CODE END\n};\n`;
    })
    return func.join('\n')+tree;
}
/*
mazafaka\(.*\)\s*\{\s*\/\/CODE BEDIN\s*([\s\S]*?)\/\/CODE END
\/\/TREE BEGIN\s*([\s\S]*?)\/\/TREE END
*/