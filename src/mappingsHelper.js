
export class mappingsHelper {

    getDefaultFields() {
        return [{name:"mergedImage",type:"image",notInRuleEditor:true},{name:"mask",type:"image",notInRuleEditor:true},{name:"hasMask",type:"boolean"},{name:"hasInitImage",type:"boolean"}
        ,{name:"prompt"},{name:"negativePrompt"},
        {name:"document_width",type:"number"},{name:"document_height",type:"number"},
        {name:"controlnet[].type"},{name:"controlnet[].image",type:"image",notInRuleEditor:true},{name:"controlnet[].strength"},{name:"controlnet[].start_percent"},{name:"controlnet[].end_percent"},{name:"controlnet[].model"}]
    }
/**
     * get list of fields which can be used for widget mappings of each ComfyUI node:
     * fields: the form fields, defined by user
     * defaultFields: the fields whoch are usually available 
     * outputFields: the output fields, like an image or multiple images
     */
    getMappingFields(metadata) {
        let fields= []
        if (metadata.forms && metadata.forms.default && metadata.forms.default.elements) fields=metadata.forms.default.elements
        let defaultFields=this.getDefaultFields()
        let outputFields=[{name:"resultImage"}]
        let res= {fields:JSON.parse(JSON.stringify(fields)),defaultFields,outputFields}
        for(let i=0;i<fields.length;i++) {
            let field=fields[i]
            if (field.split_value_num && field.split_value_type) {
                for(let k=0;k<field.split_value_num;k++) {
                    let newField={name:field.name+"_"+k,type:field.split_value_type,originalName:field.name,index:k}    // add new fields with underscore
                    res.fields.push(newField)
                }
            }
            if (field.type==="drop_layers") {
                if (field.num_layers===1) continue  // only one image
                for(let k=0;k<field.num_layers;k++) {
                    let newField={name:field.name+"_"+k,type:field.type,originalName:field.name,index:k}    // add new fields with underscore
                    res.fields.push(newField)
                }
            }
        }


        return res
    }

    getNodeByType(workflow,type) {
        return workflow.nodes.find(node => node.type === type)
      }
      getNodeById(workflow,id) {
        return workflow.nodes.find(node => node.id === id)
      }      
    addMapping(metadata,nodeId,fromField,toField) {
        if (!toField || !fromField) return
        if (!nodeId) return
        if (!metadata.mappings) metadata.mappings={}
        let mappings=metadata.mappings[nodeId]
        if (!mappings) mappings=[]
        mappings.push({ fromField,toField  })
        mappings=mappings
        metadata.mappings[nodeId] = mappings
    }    

    cleanUpMappings(metadata) {
        // @ts-ignore
        let workflow=window.app.graph.serialize()
        let fieldNames={}
        let allFields=this.getMappingFields(metadata)
        for(let i=0;i<allFields.fields.length;i++) {
            let field=allFields.fields[i]
            fieldNames[field.name]=true
        }
        for(let i=0;i<allFields.defaultFields.length;i++) {
            let field=allFields.defaultFields[i]
            fieldNames[field.name]=true
        }        
        for(let i=0;i<allFields.outputFields.length;i++) {
            let field=allFields.outputFields[i]
            fieldNames[field.name]=true
        }        
        // only use mappsings with existing fields
        for (let nodeId in metadata.mappings) {
            let mappings=metadata.mappings[nodeId]
            let filteredArray=[]
            delete metadata.mappings[nodeId]
            if (mappings) {
                for(let i=0;i<mappings.length;i++) {
                    let m=mappings[i]
                    if (fieldNames[m.fromField]) filteredArray.push(m)
                }
                if (this.getNodeById(workflow,parseInt(nodeId))) metadata.mappings[nodeId]=filteredArray            // also check if node exists anymore                
            }
           
        }
    }

}