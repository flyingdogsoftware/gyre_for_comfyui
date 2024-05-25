export class nodesManager {
    constructor() {
        // @ts-ignore
        this.allNodes=LiteGraph.registered_node_types
    }
    /**
     * check if there are some node types missing from one workflow
     * @param {*} workflow 
     * @returns {boolean} true if all is ok, false otherwise
     */
    checkMissingNodes(workflow) {
        if (!workflow.nodes) return true
        for(let i=0;i<workflow.nodes.length;i++) {
            let type=workflow.nodes[i].type
            if (!this.allNodes[type]) {
                return false
            }
        }
        return true
    }

}