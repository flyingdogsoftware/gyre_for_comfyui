
<script>
    import { createEventDispatcher } from 'svelte'
    import { metadata} from './stores/metadata'

    export let custom_ui_components
    const dispatch = createEventDispatcher()
    let showPresetManager="none"
    
    let left="100px"
    let top="100px"
    export function openDialog(e,posX,posY) {
        showPresetManager="block"
        let x=e.clientX-460/2-posX
        let y=e.clientY-560-posY
        if (x<0) x=0
        if (y<0) y=0
        if (x+460>window.innerWidth) x=window.innerWidth-460
        if (y+560>window.innerHeight) y=window.innerHeight-560
        left=x+"px"
        top=y+"px"    
    }

    export function hideDialog() {
        showPresetManager="none"
    }
   
    </script>
    <style>
            #presetManagement {
            z-index: 200;
            position: fixed;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
            padding: 10px;
            background-color: black;
            backdrop-filter: blur(20px) brightness(80%);
            box-shadow: 0 0 1rem 0 rgba(255, 255, 255, 0.2);
            color: white;
            display: block;
            border-radius: 10px;
            font-size: 14px;
            display:none;
            width:460px;
            padding-left: 20px;
        }
        #presetManagement h1 {
            font-size: 16px;
            margin:0 ;
            margin-bottom: 10px;
        }
        .close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
    .input {
        background-color: black;
        color: white;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        padding: 3px;
    }
    .presetList {
        max-height: 500px;
        overflow: auto;
        scrollbar-color: rgb(227, 206, 116) black;
        scrollbar-width: thin;
    }

        </style>


<div id="presetManagement" style="display:{showPresetManager};left:{left};top:{top};" >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="close" on:click={(e) => { hideDialog()}}>X</div>
    <h1>Preset Management</h1>
   
    <select bind:value={$metadata.presetType}  class="input">
        <option value="">none</option>
        <option value="dropdown">Dropdown</option>
        <option value="fullscreen">Fullscreen with Images</option>
        <option value="workflow">From Other Workflow</option>
        <option value="URL">External URL</option>
      </select>
      <p>
      {#if $metadata.presetType==="workflow"}
        Read Presets (e.g. Prompt Styles) from Workflow with ID #<input type="text" class="input" bind:value={$metadata.presetWorkflowId}>
      {/if}
      {#if $metadata.presetType==="URL"}
        Read Presets (e.g. Prompt Styles) from URL<input type="text" class="input" bind:value={$metadata.presetURL}>
      {/if} 
    </p>  
      <div class="presetList">


        {#if $metadata.presets && $metadata.presets.length}
            {#each $metadata.presets as preset}
                <p>{preset.name}
                {#if preset.image}
                    <br>
                    <img src={preset.image} alt={preset.name} style="width:64px">
                {/if}
                </p>
            {/each}
        {:else}
        No Presets stored in this workflow
        {/if}
    </div>
    
   
</div>
