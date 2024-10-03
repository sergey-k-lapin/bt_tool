function findRoots(nodes, edges){
    const roots = [];
    for(let n in nodes) {
        let node = nodes[n];
        let root = edges.find( (edge) => { return edge.to == node.id})
        if (!root){
            roots.push(node);
        }
    }
    return roots;
}

export function treeToCode(nodes, edges, src='') {
    //find roots
    const roots = findRoots(nodes, edges);
    // for(let n in nodes) {
    //     let node = nodes[n];
    //     let root = edges.find( (edge) => { return edge.to == node.id})
    //     if (!root){
    //         roots.push(node);
    //     }
    // }

    let functions = [];
    function getChildNodes(node){
        let childEdges = edges.filter( (child) => {return child.from === node.id});
        return childEdges.map( (edge) => { return nodes.find( (node) => {return node.id === edge.to})});
    }

    function nodeToCode(node) {
        switch(node.text){
            case 'R':{
                return `new ResetSequenceNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            }
            case 'RL':{
                return `new RunningLoopNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            }
            case 'SL':{
                return `new SuccessLoopNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            }
            case '?':
                return `new SelectorNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            case '>':
                return `new SequenceNode([\n${getChildNodes(node).map( (node) => { return nodeToCode(node)}).join(',\n')}\n])`;
            default:
                //Exevution node
                if (functions.indexOf(node.text) == -1){
                    functions.push(node.text);
                }
                return 'new ExecutionNode(this.'+node.text+', this)';
        }
    }
    // console.log(roots);

    let root = roots[0];
    let tree = '//TREE BEGIN\ntree = ' + nodeToCode(root)+'\n//TREE END';

    let func = functions.map( (f) => {
        const regex = new RegExp(`${f}\\(.*\\)\\s*\\{\\s*\\\/\\\/CODE BEGIN\\s*([\\s\\S]*?)\\\/\\\/CODE END`, 'gm')
        const matches = regex.exec(src);
        if (matches !== null){
            const body = matches[1];
            return `${f}(){\n//CODE BEGIN\n${body}//CODE END\n};\n`
        }
        return `${f}(){\n//CODE BEGIN\nreturn BT_STATES.FAILED;\n//CODE END\n};\n`;
    })
    const funcSrc = '//FUNC BEGIN\n'+func.join('\n')+'//FUNC END';
    if (/\/\/FUNC BEGIN\s*([\s\S]*?)\/\/FUNC END/gm.exec(src) !== null){
        src = src.replace(/\/\/FUNC BEGIN\s*([\s\S]*?)\/\/FUNC END/gm, funcSrc);
    } else {
        src += funcSrc+'\n';
    }

    if (/\/\/TREE BEGIN\s*([\s\S]*?)\/\/TREE END/gm.exec(src) !== null){
        src = src.replace(/\/\/TREE BEGIN\s*([\s\S]*?)\/\/TREE END/gm, tree);
    } else {
        src += tree+'\n';
    }

    return src;
}
/*
mazafaka\(.*\)\s*\{\s*\/\/CODE BEGIN\s*([\s\S]*?)\/\/CODE END
\/\/TREE BEGIN\s*([\s\S]*?)\/\/TREE END
*/

export function normalize(nodes, edges){
    const roots = findRoots(nodes, edges);
    let ID=1;
    const node = roots[0];

    function getChildNodes(node){
        let childEdges = edges.filter( (child) => {return child.from === node.id});
        return childEdges.map( (edge) => { return nodes.find( (node) => {return node.id === edge.to})});
    }

    function walk(node){
        node.newId = ID++;
        getChildNodes(node).forEach((node)=>{walk(node)});
    }
    walk(node);
    edges.forEach((edge)=>{
        let nodeFrom = nodes.find((node) => node.id == edge.from);
        let nodeTo = nodes.find((node) => node.id == edge.to);
        edge.from = nodeFrom.newId;
        edge.to = nodeTo.newId;
        edge.id = edge.from+'-'+edge.to;
    })
    nodes.forEach((node)=>{
        node.id = node.newId;
        delete node.newId;
    })
    nodes.sort((a,b) => a.id - b.id);
}