<script>
    /*
        model list editor given a list of all installed models on server
    */
    import { metadata} from './stores/metadata'
    import Icon from './Icon.svelte'

    export let availableModels = []
    if (!$metadata.models) $metadata.models=[]
// Writable store for selected model
let selectedModel = '';

// Function to add a model
function addModel() {
  if (selectedModel && !$metadata.models.includes(selectedModel)) {
    $metadata.models.push(selectedModel)
    $metadata.models=$metadata.models
    selectedModel = '' // Reset selected model after adding
    }
}

// Function to remove a model
function removeModel(index) {
  $metadata.models.splice(index,1)
  $metadata.models=$metadata.models
}

// Function to check if a model is not found in availableModels
function modelNotFound(model) {
  return !availableModels.includes(model)
}
  // Function to clean up keys by removing parenthetical content
  function cleanValue(value) {
    return value.replace(/\s*\(.*?\)\s*/g, '').trim();
  }
 // Function to add models from workflow
 function addModelsFromWorkflow() {
    let comboValues = JSON.parse(JSON.stringify($metadata.selected_combo_values))
    let currentModels = $metadata.models
    let rules=$metadata.rules
    for(let i=0;i<rules.length;i++) {
        let rule=rules[i]
        if (rule.actionType==="setValue" && rule.actionValue.includes(".")) comboValues.push(rule.actionValue)
    }
    for (let i=0;i<comboValues.length;i++) {
        let value=cleanValue(comboValues[i])
        availableModels.forEach(availableModel => {
            if (availableModel.includes(value) && !currentModels.includes(availableModel)) {
                $metadata.models.push(availableModel)
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
    height: 24px;
}
.modelEntry .deleteIcon {
    display: none;
    vertical-align: -8px;
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
</style>

<div>
<h1>Model List</h1>
<ul>
  {#each $metadata.models as model, index}
    <li class={modelNotFound(model) ? 'modelEntry not-found' : 'modelEntry'} >
      {model}
      <div class="deleteIcon">
      <Icon name="delete" on:click={(e)=>{removeModel(index)}} ></Icon>
    </div>
    </li>
  {/each}
</ul>

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
</div>