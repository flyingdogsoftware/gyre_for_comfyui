<script>
    /*
        model list editor given a list of all installed models on server
    */
    import { metadata} from './stores/metadata'
    import Icon from './Icon.svelte'
    export let no_edit=false
    export let availableModels = []
    if (!$metadata.models) $metadata.models=[]

    // conversion from old string list
    for(let i=0; i<$metadata.models.length;i++) {
        let model=$metadata.models[i]
        if (typeof model === "string") {
            let modelObj={path:model}
            $metadata.models[i]=modelObj
        }
    }

    // Writable store for selected model
let selectedModel = '';

function findModel(modelPath) {
    for(let i=0; i<$metadata.models.length;i++) {
        let model=$metadata.models[i]
        if (model.path===modelPath) return model
    }
    return false
}
// Function to add a model
function addModel() {
    if (!selectedModel) return
    if (findModel(selectedModel)) return
    $metadata.models.push({path:selectedModel})
    $metadata.models=$metadata.models
    selectedModel = '' // Reset selected model after adding    
}

// Function to remove a model
function removeModel(index) {
  $metadata.models.splice(index,1)
  $metadata.models=$metadata.models
}

// Function to check if a model is not found in availableModels
function modelNotFound(modelPath) {
  return !availableModels.includes(modelPath)
}
  // Function to clean path only file name
  function cleanValue(value) {
    return value.replace(/\s*\(.*?\)\s*/g, '').trim();
  }
 // Function to add models from workflow
 function addModelsFromWorkflow() {
    let comboValues = JSON.parse(JSON.stringify($metadata.selected_combo_values))
    let currentModels = $metadata.models
    let rules=$metadata.rules
    if (rules) {
        for(let i=0;i<rules.length;i++) {
            let rule=rules[i]
            if (rule.actionType==="setValue" && rule.actionValue.includes(".")) comboValues.push(rule.actionValue)
        }        
    }

    for (let i=0;i<comboValues.length;i++) {
        let value=cleanValue(comboValues[i])
        availableModels.forEach(availableModel => {
            if (availableModel.includes(value) && !findModel(availableModel)) {
                $metadata.models.push({path:availableModel})
            }
        })
    }
    $metadata.models=$metadata.models
  }
</script>

<style>
.not-found {
  color: #ff6e6e;
}
.modelEntry {
    list-style-type: none;
    position: relative;
    /*height: 24px;*/
}
.modelEntry .deleteIcon {
    display: none;
    top: 0px;
    right: 0px;
    position: absolute;
}
.modelEntry:hover .deleteIcon {
    display:inline-block;
}
.input {
        background-color: black;
        color: white;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        padding: 3px;
    }
h1 {
    font-size: 16px;
    margin-bottom: 30px;
}    
.inputURL {
    background-color: transparent;
    width: calc(100% - 30px);
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>

<div>
<h1>Model List</h1>
<ul>
  {#each $metadata.models as model, index}
    <li class={modelNotFound(model.path) ? 'modelEntry not-found' : 'modelEntry'} >
      {model.path}
      {#if !no_edit}
        <div><input type="text" placeholder="Source URL" bind:value={model.URL} class="input inputURL"></div>
        <div class="deleteIcon">
            <Icon name="delete" on:click={(e)=>{removeModel(index)}} ></Icon>
        </div>
        {/if}
    </li>
    
  {/each}
</ul>

{#if !no_edit}
    <div>
    <select bind:value={selectedModel} class="input">
        <option value="" disabled>Select a model</option>
        {#each availableModels as model}
        <option value={model}>{model}</option>
        {/each}
    </select>
    <button on:click={addModel}>Add Model</button>
    <button on:click={addModelsFromWorkflow}>From Workflow</button>
    </div>
{/if}
</div>