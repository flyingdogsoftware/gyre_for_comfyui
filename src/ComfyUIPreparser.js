import { rulesExecution } from './rulesExecution.js'
import { loopPreparser } from './loopPreparser.js'
import { valuePreparser } from './valuePreparser.js'
import { mappingsHelper } from './mappingsHelper.js'

export class ComfyUIPreparser {

    constructor(workflow) {
        this.workflow=workflow
        if (!workflow.extra.gyre) return
        this.metadata=workflow.extra.gyre
        this.fieldList=[]
        if (this.metadata.forms && this.metadata.forms.default)  {
            this.fieldList=new mappingsHelper().getMappingFields(this.metadata).fields
        }  
    }
    /**
     * extend workflow to set all loop nodes
     * @param {object} data 
     */
    generateLoops(data) {
        let loop=new loopPreparser(this.workflow)
        for (let name in data) {
            let value=data[name]
            if (Array.isArray(value)) {     // e.g. controlnet
                loop.generateLoop(name,data[name].length)
            }
        }
    }
    /**
     * execute rules on 
     * @param {object} data 
     */
    executeAllRules(data) {
        let rules=new rulesExecution()
        // marcin
        if(!this.metadata.rules) return;
        rules.execute(data,this.fieldList,this.metadata.rules,{},"__ignore_arrays") // first execute rules on non array props
        for (let name in data) {
            let value=data[name]
            if (Array.isArray(value)) {     // e.g. controlnet
                for(let i=0;i<data[name].length;i++) {
                    rules=new rulesExecution()
                    let arrayIdx={}
                    arrayIdx[name]=i
                    rules.execute(data,this.fieldList,this.metadata.rules,arrayIdx,name)    // execute rules on array
                }
            }
        }

    }
    /**
     * replace all mappings with real values
     * @param {object} data 
     */
    async setValues(data) {
        let vp=new valuePreparser(this.workflow)
        await vp.setValues(data)
        await vp.removeVirtualNodes()
    }
    splitCustomValues(data) {
        let vp=new valuePreparser(this.workflow)
        vp.splitCustomValues(data)
    }
    async execute(data) {
        this.generateLoops(data)
        this.executeAllRules(data)
        this.splitCustomValues(data)
        await this.setValues(data)      
      //  console.log("data",data)  
    }

    getTestData() {

        return {
            prompt: "fashion dog",
            negativePrompt: "ugly",
            hasMask: true,
            hasinitImage: true,
            rise: "0.0;0.3432423",
            rise_red: "0.1;0.55534",
            rise_gray: "2;55",
            blend_if_channel: "gray",
            controlnet:[
                { type:"pose",image:"empty"},
                { type:"depth",image:"empty"},
                { type:"scribble",image:"empty"}
            ],
            // some custom fields
            seed: 123,
            steps: 20
        }
    }

}



