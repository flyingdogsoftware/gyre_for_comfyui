import { rulesExecution } from './rulesExecution.js'
import { loopPreparser } from './loopPreparser.js'
import { mappingsHelper } from './mappingsHelper.js'


export class valuePreparser {

    constructor(workflow) {
      this.workflow = workflow
      this.loopParser=new loopPreparser(workflow)
      this.rules=new rulesExecution()
      if (!workflow.extra.gyre) return
      this.metadata=workflow.extra.gyre
      this.fieldList=[]
      if (this.metadata.forms && this.metadata.forms.default)  {
        this.fieldList=new mappingsHelper().getMappingFields(this.metadata).fields
        //this.fieldList=this.metadata.forms.default.elements
      }
    }

    getWidgetIndex(nodeId,name) {
        let nodeWidgets=this.workflow.extra.gyre.nodeWidgets
        for(let nId in nodeWidgets) {
            if (parseInt(nId)===nodeId) {
                let widgets=nodeWidgets[nId]
                for(let i=0;i<widgets.length;i++) {
                    let widget=widgets[i]
                    if (widget.name===name) return i
                }
            }
        }
        return -1
    }
    getLinkById(linkId) {
        return this.workflow.links.find(linkArr => linkArr[0] === linkId)

    }
    getNodeById(nodeId) {
        return this.workflow.nodes.find(node => node.id === nodeId)
      }
    /* mergedImage, mask, controlnet[].image
    */
    async getImage(propertyName, arrayName="",index=0) {
        if(window.postMessageAdapter){
            let instance = window.postMessageAdapter.getWorkflowImageRequestServerInstance();
            let res = await instance.getSingleImage(propertyName, arrayName,index);
            return res;
        }
        return null;
    }
    /**
     * get layer image
     * @param {string} layerName , special names: currentLayer, currentLayerAbove, currentLayerBelow
     * @param {string} layerID , as alternative select layer by ID
     */
    async getLayerImage(layerName,layerID) {
        if(window.postMessageAdapter){
            let instance = window.postMessageAdapter.getWorkflowImageRequestServerInstance();
            let res = await instance.getLayerImage(layerName,layerID);
            return res;
        }
        return null;
    }
    /**
     * convert value (e.g. boolean) also get images from frontend
     * @param {*} value 
     * @param {object} field 
     * @param {string} arrayName 
     * @param {number} index 
     * @returns 
     */
    async convertValue(value,field,arrayName="",index=0) {
        if (field.type==="image") {

                if (!arrayName) {

                    return await this.getImage(field.name)
                } else {
                    let propertyName= field.name.split(".")[1]  // e.g. image from controlnet[].image
                    return await this.getImage(propertyName,arrayName,index) // e.g. image,controlnet,0 for controlnet[0].image            
                }
        }
        if (field.type==="layer_image") {
            return await this.getLayerImage(field.name)
        }
        if (field.type==="drop_layers") {
            let idx=0
            if (field.originalName) {
                idx=field.index
            }
            let arr=value.split(",")
            let layerID=arr[idx]
            return await this.getLayerImage(null,layerID)
        }
        if(field.type=="number" && !field.step && value) field.step=value;
        return  this.rules.convertValue(value,field)
    }
    /**
     * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) and set value
     * @param {object} field the field object {name,type,min,max,...}
     * @param {string} fromFieldName full name with array name and index (e.g. "steps" or "controlnet[0].model")
     * @param {*} value 
     */
    async setNodesValue(field,fromFieldName,value) {
        for (let nodeId in this.metadata.mappings) {
            let mappingList=this.metadata.mappings[nodeId]

            if (!mappingList || !mappingList.length) continue
            let nodeIdInt=parseInt(nodeId)
            let node=this.loopParser.getNodeById(nodeIdInt)
            if (!node) {
                console.log("could not find node with id ",nodeIdInt,fromFieldName,value)
                continue
            }

            /**
             * workaround for ComfyUI bug: linked values are not transferred to target node, have to do it manually
             */
            let targetFieldName=""
            let targetIndex=-1
            let targetNode=null
            if (node.outputs && node.outputs.length && node.outputs[0].widget) {
                targetFieldName=node.outputs[0].widget.name
                let linkId=node.outputs[0].links[0]
                let link=this.getLinkById(linkId)
                let targetNodeId=link[3]
                targetIndex=this.getWidgetIndex(targetNodeId,targetFieldName)
                if (targetIndex>=0) {
                    targetNode=this.getNodeById(targetNodeId)
                }
            }
            if (node) {
                for(let i=0;i<mappingList.length;i++) {
                    let mapping=mappingList[i]
                    
                    if (mapping && mapping.fromField===fromFieldName) {
                        value=await this.convertValue(value,field)
                        node.widgets_values[parseInt(mapping.toIndex)]=value
                        if (targetNode) {
                            targetNode.widgets_values[targetIndex]=value
                        }
                    }                
                }
            }

        }
    }
    /**
     * find all nodes which are connected to a mapping (nodeId, fieldFrom,toField) inside a group and set value
     * @param {object} field the field object {name,type,min,max,...}
     * @param {string} fromFieldName full name with array name without index "controlnet[].model")
     * @param {string} groupName the group name - e.g. controlnet[0], controlnet[1],...
     * @param {string} arrayName  the array name - e.g. controlnet
     * @param {number} arrayName  the index in array (0,1,...)
    * @param {*} value 
     */
    async setNodesValueGroup(field,fromFieldName,groupName,value,arrayName,index) {
        for (let i=0;i<this.workflow.nodes.length;i++) {
            let node=this.workflow.nodes[i]
            if (this.loopParser.isNodeInGroup(node.id,groupName)) { // only nodes in group
                let mappingList=this.metadata.mappings[node.id]
                if(mappingList && mappingList.length) {
                    for (let i = 0; i < mappingList.length; i++) {
                        let mapping = mappingList[i]
                        if (mapping && mapping.fromField === fromFieldName) {
                            value = await this.convertValue(value, field, arrayName, index)
                            node.widgets_values[parseInt(mapping.toIndex)] = value
                        }
                    }
                }
            }
        }
    }
    removeVirtualNodes() {

        // Iterate backwards to avoid indexing issues after removal
        for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
            const node = this.workflow.nodes[i];
            let isVirtualNode = false;
            if(this.workflow.extra.gyre.virtualNodes && this.workflow.extra.gyre.virtualNodes.length){
                isVirtualNode =  this.workflow.extra.gyre.virtualNodes.includes(node.type);
            }

            if (isVirtualNode || node.type === "PrimitiveNode") {
                const outgoingLink = this.workflow.links.find(link => link[1] === node.id);

                // Remove the  link
                if (outgoingLink) this.workflow.links = this.workflow.links.filter(link => link[0] !== outgoingLink[0])

                // Remove the GyreLoop node
                this.workflow.nodes.splice(i, 1)
            }
        }
    }

    /**
     * Modify workflow values by using mapping and data from image editor
     * data object has to be filled with
     *  prompt
     *  negativePrompt
     *  hasMask
     *  optional: controlnet array
     * @param {object} data 
     */
    async setValues(data) {
        if (!this.metadata) return
        if (!this.metadata.mappings) return
        for (let name in data) {
            let value=data[name]
            if (!Array.isArray(value)) {
                let field=this.rules.getField(name,this.fieldList)
                if (field) await this.setNodesValue(field,field.name,value)
            } else {
                // replace array of object values
                let arrayName=name
                for(let i=0;i<data[arrayName].length;i++) {
                    let element=data[arrayName][i]
                    for(let propName in element) {
                        let fieldName=arrayName+"[]."+propName      // e.g. controlnet[].type
                        let fieldNameIndex=arrayName+"["+i+"]."+propName      // e.g. controlnet[0].type
                        let value=element[propName]
                        let field=this.rules.getField(fieldName,this.fieldList)
                        await this.setNodesValue(field,fieldNameIndex,value)
                        let groupName=arrayName+"["+i+"]"                // e.g. controlnet[0]
                        await this.setNodesValueGroup(field,fieldName,groupName,value,arrayName,i)
                    }
                }
            }
        }

    }
    /**
     * split values in CSV format from string into seperate values with field_0, field_1
     * values are separated by ;
     * Definition by split_value_num and split_value_type
     * @param {*} data 
     */
    splitCustomValues(data) {
        for (let name in data) {
            let value=data[name]
            let field=this.rules.getField(name,this.fieldList)
            if (field && field.split_value_num && field.split_value_type) {
                let arr=value.split(";")
                for(let i=0;i<field.split_value_num;i++) {
                    let v=arr[i]
                    // type conversion
                    let splitField={name:name+"_"+i,type:field.split_value_type,step:parseFloat(v)}

                    v=this.rules.convertValue( v,splitField)  
                    data[name+"_"+i]=v
                }
            }
        }
    }
}