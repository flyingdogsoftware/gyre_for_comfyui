<script>
    /*
        model list editor given a list of all installed models on server
        now with model download support
    */
    import {onMount} from 'svelte'   
    import { createEventDispatcher } from 'svelte'    
    import { metadata} from './stores/metadata'
    import { mappingsHelper } from './mappingsHelper.js'

    import Icon from './Icon.svelte'
    export let no_edit=false
    export let availableModels = []
    if (!$metadata.models) $metadata.models=[]
    const dispatch = createEventDispatcher()

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
    findModelURL($metadata.models.length-1)
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
    let comboValues=new mappingsHelper().getSelectedComboValues()
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
    for(let i=0;i<$metadata.models.length;i++) {
        findModelURL(i)
    }
    $metadata.models=$metadata.models
  }

let downloadingNow=false
async function downloadModels() {
    let response=await fetch("/gyre/download_progress")
    let res=await response.json()
    if (downloadingNow || Object.keys(res).length) {
        alert("Already downloading models")
        return
    }
    try {
        downloadingNow=true
        setTimeout(() => {   startProgress()},1000)
        let response = await fetch("/gyre/download_models?id="+$metadata.workflowid)  
        let result = await response.json();            
        return result;
    } catch (error) {
        downloadingNow=false
       // alert("Error downloading models  " + error);
    }
}
    function findModelURL(index) {
        let model=$metadata.models[index]
        const fileName = model.path.split('/').pop()
        for(let i=0;i<ManagerModels.models.length;i++) {
            let mmodel=ManagerModels.models[i]
            if (fileName===mmodel.filename) {
                model.URL=mmodel.url
            }
        }
        $metadata.models=$metadata.models
    }
let progress={}
let intervalID=0
async function startProgress() {
    progress={}
    if (intervalID) clearInterval(intervalID)


    intervalID = setInterval(async () => { 
        let response=await fetch("/gyre/download_progress")
        progress=await response.json()
        $metadata.models=$metadata.models   // refresh template
        if (!downloadingNow && !Object.keys(progress).length) {
            dispatch("downloadFinished")
            clearInterval(intervalID)
            setTimeout(() => {
                $metadata.models=$metadata.models
             },1000)
            downloadingNow=false
        } else {        
            let allDownloaded=true          // check if downloads finished
            for(let key in progress) {

                let percent=progress[key]
                if (percent!=="canceled" && parseInt(percent)<100) {
                    allDownloaded=false
                    break
                } 
            }
            if (allDownloaded) {
                await fetch("/gyre/clear_download_progress")    // confirm finished downloads
                downloadingNow=false
                clearInterval(intervalID)
                dispatch("downloadFinished")
                progress={}
                setTimeout(() => {
                    $metadata.models=$metadata.models
                },1000)                
            }
        }
        
    },500)
}
async function cancelDownload(modelPath) {
    let index=0
    for(let i=0;i<$metadata.models.length;i++) {
        let model=$metadata.models[i]
        if (progress[model.path]) {
            if (modelPath===model.path) {
                await fetch("/gyre/cancel_download/?index="+index)
            }
            index++
        }
    }

    
}
let ManagerModels=[]
onMount(async () => {
    startProgress()     // check progress after page reload
    let result=await fetch("https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/model-list.json")
    ManagerModels=await result.json()
})
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
    right: 10px;
    position: absolute;
}
.modelEntry:hover .deleteIcon {
    display: block;
}
.modelEntry:hover .inputModelURL {
    opacity: 1.0;
    transition: opacity 0.5s;
}
.input {
        background-color: black;
        color: white;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        padding: 3px;
        width: calc(100% - 30px);
    }
h1 {
    font-size: 16px;
    margin-bottom: 30px;
}    
.progressBarContainer {
    width: calc(100% - 30px);
    margin-top:13px;
    margin-bottom:13px;   
    white-space: nowrap; 
    position: relative;
}
.progress {
    height: 10px;
    background-color: green;
    transition: 0.1s;
    display: inline-block;

}
.inputURL {
    background-color: transparent;

    margin-top: 10px;
    margin-bottom: 10px;

}
.inputModelURL {
        opacity: 0;
}
.progressBarContainer .Cancel {
    display: none;
    position: absolute;
    right:0;
    top: 0;
}
.progressBarContainer:hover .Cancel {
    display: block;
}
</style>

<div>
<h1>Model List</h1>
<ul>
{#if $metadata.models}
  {#each $metadata.models as model, index}
    <li class={modelNotFound(model.path) && !progress[model.path] ? 'modelEntry not-found' : 'modelEntry'} title="{model.URL}">
      {model.path}
      {#if progress[model.path]}
        <div class="progressBarContainer">
            {#if progress[model.path]==="canceled"}
                Canceled
            {:else}
                <div class="progress" style="width:{parseInt(progress[model.path])}%;"></div> {parseInt(progress[model.path])}%
                <button class="Cancel" on:click={() => { cancelDownload(model.path)}}>Cancel</button>
            {/if}
        </div>
      {/if}
      {#if !no_edit && !progress[model.path]}
        <div class="inputModelURL">
            <input type="text" placeholder="Source URL" bind:value={model.URL} class="input inputURL">
            <Icon name="find" on:click={(e)=>{findModelURL(index)}}></Icon>
        </div>
        <div class="deleteIcon">
            <Icon name="deactivated" on:click={(e)=>{removeModel(index)}} title="Remove from list - it will be not deleted in filesystem."></Icon>
        </div>
        {/if}
    </li>
    
  {/each}
{/if}
</ul>

{#if !no_edit}
    <div>
    <select bind:value={selectedModel} class="input">
        <option value="" disabled>Select a model</option>
        {#each availableModels as model}
        <option value={model}>{model}</option>
        {/each}
    </select>
    {#if !downloadingNow}
        <button on:click={addModel}>Add Model</button>
        <button on:click={addModelsFromWorkflow}>From Workflow</button>
    {/if}
    </div>
{/if}
{#if !downloadingNow}
    <button on:click={downloadModels}>Download missing Models</button>
{/if}
</div>