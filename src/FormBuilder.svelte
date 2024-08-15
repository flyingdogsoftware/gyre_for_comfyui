<script>
  import FormElement from './FormElement.svelte';
  import { metadata} from './stores/metadata'
  import { rulesExecution } from './rulesExecution.js'
  import formTemplate_Txt2Image  from './form_templates/txt2image.json'
  import formTemplate_LayerMenu  from './form_templates/layermenu.json'
  import { mappingsHelper } from './mappingsHelper.js'
  import FieldSelector from "./fieldSelector.svelte"
  import PresetManagement from "./presetManagement.svelte"

  import { createEventDispatcher } from 'svelte'
  import { onMount } from 'svelte';
  import { modelsManager } from './modelsManager';

  const dispatch = createEventDispatcher()

  if (!$metadata.forms) $metadata.forms={}

  export let form_key='default'  // support for multiple forms (e.g. wizards) in the future
  export let data={}            // the form data
  export let refresh  
  export let posX,posY        // position of the parent dialog
  export let custom_ui_components
  export let no_edit=false
  export let availableModels
  if (!$metadata.forms[form_key]) $metadata.forms[form_key]={elements:[]}
  if (!$metadata.forms[form_key].elements) $metadata.forms[form_key].elements=[]
  let formElements = $metadata.forms[form_key].elements
  ensureUniqueNames()
  setDefaultValues()

  let dragStartIndex=-1
  let showPropertiesIdx=-1
  let selectedType

  function ensureUniqueNames() {
  const nameMap = {}; // Object to keep track of names and their occurrences

  formElements.forEach(element => {
    let name = element.name;
    // Check if the name already exists in the nameMap
    if (nameMap[name]) {
      // If the name exists, increment the count and append it to the name
      let count = nameMap[name];
      let newName = `${name}_${count}`;
      while (nameMap[newName]) { // Ensure the new name is also unique
        count++;
        newName = `${name}_${count}`;
      }
      element.name = newName;
      nameMap[name]++;
      nameMap[newName] = 1; // Initialize this new name in the nameMap
    } else {
      // If the name doesn't exist, add it to the nameMap
      nameMap[name] = 1
    }
  })
}
  $: {
    if (refresh) {
      for(let i=0;i<formElements.length;i++) {
        let element=formElements[i]
        if (!data[element.name]) data[element.name]=element.default
      }
      formElements=formElements
    }
  }
  onMount(() => {
    if (!data || !formElements) return

    let re=new rulesExecution()    
    let res=re.execute(data,formElements,$metadata.rules,{"controlnet":0})
    if (!res) return
    data=res.data
    if (res.hiddenFields.length || res.showFields.length) formElements=formElements
  })

  function addElement(e) {
    fieldSelector.hideDialog()
    let newElement=e.detail
    if (!newElement) return
    if (newElement.custom) {    // custom element
      let field={
        type: "custom",
        tag: newElement.tag,
        name: newElement.parameters.name.default,
        label: newElement.parameters.label.default,
        default: newElement.parameters.default.default,
        parameters: newElement.parameters
      }
      if (newElement.split_value_num) field.split_value_num=newElement.split_value_num
      if (newElement.split_value_type) field.split_value_type=newElement.split_value_type
      // set default values
      for(let name in newElement.parameters) {
        let p=newElement.parameters[name]
        if (p.name!=="name" && p.name!=="label" && p.name!="default") {
          field[name]=p["default"]
        }
      }
      newElement=field
    }
    formElements.push(newElement)
    ensureUniqueNames()
    formElements=formElements
    showPropertiesIdx=formElements.length-1
    setDefaultValues()    
  }

  function handleDragStart(event, index) {
    if (!advancedOptions) return
    dragStartIndex = index
  }
  /**
   * drag and drop to change order in list
   * @param event
   */
  function handleDragOver(event) {
    if (!advancedOptions) return
    event.preventDefault() // Necessary to allow dropping
  }

  function handleDrop(event, dropIndex) {
    if (!advancedOptions) return
    event.preventDefault()
    if (dragStartIndex === dropIndex) return
    
    const draggedItem = formElements[dragStartIndex];
    const remainingItems = formElements.filter((_, index) => index !== dragStartIndex)
    const reorderedItems = [
        ...remainingItems.slice(0, dropIndex),
        draggedItem,
        ...remainingItems.slice(dropIndex)
    ]
    // Reassign the reordered items back to formElements
    formElements = reorderedItems
    formElements=formElements
    // Reset dragged index
    dragStartIndex = -1
    $metadata.forms[form_key].elements=formElements
}
/**
 * updates elements data (e.g. name, label,...)
 * @param index
 * @param element
 */
  function updateElement(index,element) {
    formElements[index]=element
    ensureUniqueNames()
    setDefaultValues()
    $metadata.forms[form_key].elements=formElements
    let helper=new mappingsHelper()
    helper.cleanUpMappings($metadata)
  }

  function cloneElement(index,element) {
    let cloneElement=JSON.parse(JSON.stringify(element))
    formElements.push(cloneElement)
    ensureUniqueNames()
    formElements=formElements
    showPropertiesIdx=formElements.length-1
    setDefaultValues()    
  }
  /**
   * remove one element from form
   * @param index
   */
  function removeElement(index) {
//    selectWorkflowType=false
    formElements.splice(showPropertiesIdx,1);
    formElements=formElements;
    showPropertiesIdx=-1 
    $metadata.forms[form_key].elements=formElements    
    let helper=new mappingsHelper()    
    helper.cleanUpMappings($metadata)
  }

  let advancedOptions=true
  /**
   * hide/show parts of the form
   * @param element
   * @param index
   */
  function checkAdvancedOptions(element,index) {
    if (advancedOptions) return "block"
    if (element.type==="advanced_options") return "block"
    let advancedOptionsIndex=-1
    for(let i=0;i<formElements.length;i++) {
      let e=formElements[i]
      if  (e.type==="advanced_options") advancedOptionsIndex=i
    }

    if (advancedOptionsIndex<0) { // element does not exists anymore
      advancedOptions=true
      return "block"
    }
    if (index <advancedOptionsIndex) return "block" // before advanced options
    return "none"
  }


  function executeRules(element,value) {
    // first set the new value
    data[element.name]=value
    data.controlnet=[]
    data.controlnet[0]={"type":"pose"}
    // now execute rules
    let re=new rulesExecution()    
    let res=re.execute(data,formElements,$metadata.rules,{"controlnet":0})
    if (!res) return
    data=res.data
    if (res.hiddenFields.length || res.showFields.length) formElements=formElements
  }
  function setDefaultValues() {
    if (!formElements) return
    for(let i=0;i<formElements.length;i++) {
      let field=formElements[i]
      if (!data[field.name]) data[field.name]=field.default
    }
  }

let selectWorkflowType=false
 function quickstart(type) {
  let workflow=window.app.graph.serialize()
  let helper=new mappingsHelper
  // 1. set default form
  if (type==="Txt2Image" || type==="Inpainting") {
    $metadata.forms=formTemplate_Txt2Image
    formElements=$metadata.forms.default.elements
    setDefaultValues()
    if (($metadata.tags || !$metadata.tags.length) && type==="Txt2Image") {
      $metadata.tags=["Txt2Image"]
    }
    if (($metadata.tags || !$metadata.tags.length) && type==="Inpainting") {
      $metadata.tags=["Txt2Image","Inpainting"]
    }    
  } 
  if (type==="LayerMenu") {
    $metadata.forms=formTemplate_LayerMenu
    formElements=$metadata.forms.default.elements
    if (!$metadata.tags || !$metadata.tags.length) $metadata.tags=["LayerMenu"]
    setDefaultValues()
  }

  // 2. set default mappings: output image
  let node=helper.getNodeByType(workflow,"SaveImage")
  if (node) {   
    helper.addMapping($metadata,node.id,"resultImage","filename_prefix")
  }
  // 3. input image mappings
  if (type==="LayerMenu") {
    let node=helper.getNodeByType(workflow,"LoadImage")
    if (node) {   
      helper.addMapping($metadata,node.id,"currentLayer","image")
    }
  }
  // 3. input image mappings
  if (type==="Txt2Image") {
    let node=helper.getNodeByType(workflow,"LoadImage")
    if (node) {   
      helper.addMapping($metadata,node.id,"mergedImage","image")
    }
  }  
  selectWorkflowType=false
   dispatch("refreshTags",$metadata.tags)
 }
 let fieldSelector
 let presetManagement

</script>

<PresetManagement bind:this={presetManagement} ></PresetManagement>


<div class="formBuilder">
<h1>Edit form</h1>
<div class="form">
  {#if !formElements.length}
    {#if !selectWorkflowType}
      <button on:click={()=>{selectWorkflowType=true}}>Quickstart</button>
    {:else}
      Quickstart - Select type:<br><br>
      <button on:click={()=>{quickstart("Txt2Image")}}>Txt2Image</button>
      <button on:click={()=>{quickstart("Inpainting")}}>Inpainting</button>
      <button on:click={()=>{quickstart("LayerMenu")}}>LayerMenu</button>
    {/if}


  {/if}
  {#if no_edit}
    Readonly Mode. Duplicate Workflow for editing.
  {/if}
  {#each formElements as element, index (element.name)}
    <div
      class="draggable"
      draggable="true"
      style="display:{checkAdvancedOptions(element,index)}"
      on:dragstart={() => handleDragStart(event, index)}
      on:dragover={handleDragOver}
      on:drop={() => handleDrop(event, index)}>
      <FormElement {element} bind:advancedOptions={advancedOptions}
        on:redrawAll={(e) => {formElements=formElements}}

        on:openProperties={() => {showPropertiesIdx=index }} 
        on:closeProperties={() => {showPropertiesIdx=-1 }}
        on:update={(e) => { updateElement(index,e.detail)  }}
        on:clone={(e) => { cloneElement(index,e.detail)  }}
        on:delete={(e) => { removeElement(index) }}
        value={data[element.name]}
        on:change={e => { executeRules(element,e.detail.value); formElements=formElements; }}
        showProperties={showPropertiesIdx===index}
        {no_edit}
        {availableModels}
        />
      </div>
  {/each}
</div>
<div>
 {#if !no_edit}
  <button on:click={(e) => fieldSelector.openDialog(e,posX,posY)}>+ Add Element</button><br>
  <button on:click={(e) => presetManagement.openDialog(e,posX,posY)}>Preset Management</button>

{/if}
</div>
</div>
<style>
  .formBuilder {
    padding: 10px;
    color: white;
    width: 470px;
    display: block;
  }
  .formBuilder h1 {
    font-size: 16px;
    margin-bottom: 30px;
  }
  .draggable {
    cursor: grab;
  }
  .form {
    border-radius: 5px;
    background-color: black;
    width: 450px;
    padding: 10px;
    color: white;
    font: "Segoe UI", Roboto, system-ui;
    font-size:14px;
    margin-bottom: 10px;
  }
  .formBuilder .add_field_select_label {
    display: inline-block;
  }
  .formBuilder .add_field_select {
        margin-right: 10px;
        background-color: black;
        color: white;
        padding: 5px;   
        display: inline-block;
  }
    .formBuilder button {
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
</style>