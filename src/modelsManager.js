export class modelsManager {
    constructor(availableModels) {
        this.availableModels=availableModels
    }
    /**
     * check if there are some models missing from one workflow
     * @param {*} workflow 
     * @returns {boolean} true if all is ok, false otherwise
     */
    checkMissingModels(workflow) {
        if (!workflow.extra || !workflow.extra.gyre || !workflow.extra.gyre.models) return true
        if (!this.availableModels) return true
        let models=workflow.extra.gyre.models
        for(let i=0;i<models.length;i++) {
            let model=models[i]
            if (!this.availableModels.includes(model)) return false
        }
    
        return true
    }

}