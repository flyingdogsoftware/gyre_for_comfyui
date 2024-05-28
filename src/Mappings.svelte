<script>
    import { metadata} from './stores/metadata'
    import Icon from './Icon.svelte'
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher()

    export let render=true
    import { mappingsHelper } from './mappingsHelper.js'
  import { insert_hydration_dev } from 'svelte/internal';

    let showGyreMappings="none"
    let gyreMappingsDialogLeft="100px"
    let gyreMappingsDialogTop="100px"
    let widgets=[]
    let nodeType=""
    let mH=new mappingsHelper()
    let mappingFields=mH.getMappingFields($metadata)
    let nodeId=0
    function openGyreMappings(node,e) {
        mappingFields=mH.getMappingFields($metadata)
        showGyreMappings="block"
        nodeId=node.id
        let x=e.clientX-480/2
        let y=e.clientY-200
        if (x<0) x=0
        if (y<0) y=0
        if (x+480>window.innerWidth) x=window.innerWidth-540
        if (y+400>window.innerHeight) y=window.innerHeight-400

        gyreMappingsDialogLeft=x+"px"
        gyreMappingsDialogTop=y+"px"
        
        widgets=node.widgets
        console.log("W",widgets)
        nodeType=node.type
        if (!$metadata.mappings) $metadata.mappings={}
        mappings=$metadata.mappings[nodeId]
        if (!mappings) mappings=[]
    }

    window.openGyreMappings=openGyreMappings    // expose open function so it can be called from ComfyUI menu extension

    // check of a widget (=a node property) is connected to a form field
    function checkGyreMapping(node,widget,index) {
        if  (!$metadata.mappings) return
        if (!$metadata.mappings[node.id]) return
        for(let i=0;i<$metadata.mappings[node.id].length;i++) {
            let mapping=$metadata.mappings[node.id][i]
          //  console.log("name",widget.name,index)
            if (mapping.toField===widget.name) { 
                mapping.toIndex=index
                let label=(widget.label || widget.name)
                return label+"="+mapping.fromField
            }
        }
    }
    window.checkGyreMapping=checkGyreMapping

    function gyreSetComboValues(widget) {           // todo: find out in future where to directly get these information
        if (widget.type!=="combo" || !widget.options  || !widget.options.values || !widget.name ) return
        if (widget.name==="image") return
  //      if(!$metadata.combo_values) $metadata.combo_values = {}
//        $metadata.combo_values[widget.name]=widget.options.values //widget.options
        let value=widget.value
        if (!$metadata.selected_combo_values) $metadata.selected_combo_values=[]
        if (!$metadata.selected_combo_values.includes(value)) $metadata.selected_combo_values.push(value)
    }
    window.gyreSetComboValues=gyreSetComboValues

    function gyreClearAllComboValues() {
        $metadata.combo_values = {}
        $metadata.selected_combo_values=[]
    }
    window.gyreClearAllComboValues=gyreClearAllComboValues

    function closeDialog() {
        showGyreMappings="none"
    }


    let mappings = []
    let fromField=""
    let toField=""
    let addField=""

    function addMapping() {
        if (!toField || !fromField) return
        if (!nodeId) return
        mappings.push({ fromField,toField  })
        mappings=mappings
        $metadata.mappings[nodeId] = mappings
        fromField=toField=addField=""
    }    

    function addFormField(fieldName) {
        if (!nodeId) return
        if (!fieldName) return
        if (checkIfFieldNameExists(fieldName)) return
        let widget=getWidget(fieldName)
        if (!widget) return
        let type=widget.type
        let label=fieldName
        label=label.replace(/_/g, " ");
        label=label.charAt(0).toUpperCase() + label.slice(1)
        let field={name:fieldName,label,default:widget.value}
        if (type==="number") {
            field.type="slider"
            if (widget.options) {
                field.min=widget.options.min
                field.max=widget.options.max
                field.step=widget.options.round       
               // field.default=field.min         
            }            
        }
        if (type==="customtext") {
            field.type="textarea"
        }
        if (type==="text") {
            field.type="text"
        }
        if (type==="combo") {
            field.type="pre_filled_dropdown"
            field.widget_name=fieldName
        }
        if (type==="toggle") {
            field.type="checkbox"
         //   field.default="false"
        }
        if (!field.type) return
    
        if (!$metadata.forms) $metadata.forms={}
        if (!$metadata.forms.default) $metadata.forms.default={}
        if (!$metadata.forms.default.elements) $metadata.forms.default.elements=[]
        let formFields=$metadata.forms.default.elements
        formFields.push(field)
        mappings.push({ fromField:fieldName,toField:fieldName  })
        mappings=mappings
        $metadata.mappings[nodeId] = mappings
        fromField=toField=addField=""
      // 
    }   
    function getWidget(fieldName) {
        if (!widgets) return
        for(let i=0;i<widgets.length;i++) {
            let widget=widgets[i]
            if (widget.name===fieldName) return widget
        }    
    }
    function deleteMapping(index) {
        mappings.splice(index, 1);
        mappings=mappings
        $metadata.mappings[nodeId] = mappings
    }
    function checkIfFieldNameExists(name) {
        if (!$metadata.forms) return false
        if (!$metadata.forms.default) return false
        let formFields=$metadata.forms.default.elements
        if (!formFields) return false
        for(let i=0;i<formFields.length;i++) {
            let field=formFields[i]
            if (field.name===name) return true            
        }       
        return false
    }
    function addAllFormFields() {
        if (!widgets) return
        for(let i=0;i<widgets.length;i++) {
            let widget=widgets[i]
            addFormField(widget.name)
        }    
        dispatch("updateForm",{})
    }
</script>
{#if render}

<div id="gyre_mappings" style="display:{showGyreMappings};left:{gyreMappingsDialogLeft};top:{gyreMappingsDialogTop}" >
    {#if widgets && widgets.length}

    <h1>Field Mappings</h1>
        <div>{nodeType}</div>

        <select  bind:value={fromField}>
            <option value="">Select...</option>
            <optgroup label="Form fields">
              {#each mappingFields.fields as field}
                    <option value={field.name}>{field.name}</option>
                {/each}
            </optgroup>
         <optgroup label="Defaults">
                {#each mappingFields.defaultFields as field}
                    <option value={field.name}>{field.name}</option>
                {/each}
            </optgroup>     
            <optgroup label="Outputs">
                {#each mappingFields.outputFields as field}
                    <option value={field.name}>{field.name}</option>
                {/each}
            </optgroup>                    
        </select>
        <Icon name="arrowRight"></Icon>
        <select bind:value={toField} >
            <option value="">Select...</option>
            {#each widgets as widget}
                <option value={widget.name}>{widget.name}</option>
            {/each}
        </select>
        <button on:click={(e) => {addMapping()}}>+ Add</button>  
        <div>
            <button on:click={(e) => {addFormField(addField);dispatch("updateForm",{})}}>Add form field from</button>     
            <select bind:value={addField} >
                <option value="">Select...</option>
                {#each widgets as widget}
                    {#if !checkIfFieldNameExists(widget.name)}
                       <option value={widget.name}>{widget.name}</option>
                    {/if}
                {/each}
            </select>
        </div>
        <div>
            <button on:click={(e) => {addAllFormFields()}}>Add  all fields to form</button>     
        </div>

        {#each mappings as mapping, index}
            <div class="mapping">
                {mapping.fromField} <Icon name="arrowRight"></Icon>{mapping.toField}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="del" on:click={(e) => {deleteMapping(index)}}><Icon name="removeFromList"></Icon></div>
            </div>
        {/each}

{:else}        
<p style="margin-top:30px">
Nothing to do here. Please select node with widgets. So for example you cannot set mappings on a "Preview image node" use "Save image" instead.
</p>

{/if}
<div class="close"><Icon name="close" on:click={(e)=>{closeDialog()}}></Icon></div>

</div>

{/if}
<style>


#gyre_mappings .mapping {
    border: 1px solid white;
    margin-top:10px;
    padding:5px;
    position: relative;
}
#gyre_mappings .mapping .del {
    position: absolute;
    right:10px;
    top: 2px;
}



#gyre_mappings button {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        font-size: 14px;
        min-width: 70px;
        color: black;
        background-color: rgb(227, 206, 116);
        border-color: rgb(128, 128, 128);
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }
#gyre_mappings {
    z-index: 200;
    position: fixed;
    left: 10px;
    top: 10px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
    padding: 20px;
    backdrop-filter: blur(20px) brightness(80%);
    box-shadow: 0 0 1rem 0 rgba(255, 255, 255, 0.2);
    color: white;
    width: 540px;
    display: block;
    border-radius: 10px;
    font-size: 14px;
}
#gyre_mappings {
    display:none;
    width:480px;
    left:200px;
    top:200px;
}
#gyre_mappings select {
    background-color: grey;
    font-size: 14px;
    color: white;
    border: none;
    margin-top: 10px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
    padding: 3px;
}
#gyre_mappings select {
    background: transparent;
    border: 1px solid white;
    border-radius: 5px;
}
#gyre_mappings select option,#gyre_mappings select optgroup {
    background: black;
}
#gyre_mappings h1 {
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 30px;
}
#gyre_mappings .close {
    position: absolute;
    right: 20px;
    top:20px;
}
</style>