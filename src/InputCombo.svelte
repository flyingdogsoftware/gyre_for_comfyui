<script>
  

  import {metadata} from "./stores/metadata";
  import { mappingsHelper } from './mappingsHelper.js'
  import { onMount } from 'svelte'

  export let value=""
  import Icon from './Icon.svelte'
  let showBox=false

  onMount(() => {
        if(!$metadata.combo_values) $metadata.combo_values = {}
        let mh=new mappingsHelper()
        mh.setComboValues($metadata.combo_values)
  })
  </script>
  
  <style>
    
    .input {
        background-color: black;
        color: white;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        padding: 3px;
    }
    .input option {
      background-color: black;
        color: white;
    }
    .input optgroup {
      background-color: black;
        color: white;
    }
  </style>
<input type="text" {value} class="input" on:change={(e) => { value=e.target.value; showBox=false}}><Icon name="comboList" on:click={(e) => {showBox=true}}></Icon>
{#if showBox}
  <select class="input" on:change={(e) => { value=e.target.value; showBox=false}}>
    <option>Select...</option>
    {#each Object.entries($metadata.combo_values) as [title,values]}
      <optgroup label={title}>
      {#each values as v}
        <option {v}>{v}</option>
      {/each}
    </optgroup>
    {/each}
  </select>
{/if}