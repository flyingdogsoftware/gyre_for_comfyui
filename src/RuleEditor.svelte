<script>
  
    

    import { metadata} from './stores/metadata'
    import InputCombo  from './InputCombo.svelte'
    import { onMount } from 'svelte';
    import { mappingsHelper } from './mappingsHelper.js'
    export let no_edit=false

    let mH=new mappingsHelper()

    let MappingsCopmponent
    let conditions = ['==', '!=', '>', '<', '>=', '<='];
    let editingIndex = null; // Index of the currently editing rule
    if (!$metadata.rules) $metadata.rules=[]
    let fields=$metadata.forms.default.elements // get form fields
    let rules = $metadata.rules
    let mappingFields={defaultfields:[]}
    function addRule() {
      rules.push({ fieldName: '', condition: '', actionType: '', rightValue:'', targetField: '', actionValue: '' });
      rules=rules
      editingIndex=rules.length-1
      $metadata.rules = rules;
    }
    onMount(() => {
      mappingFields=mH.getMappingFields($metadata)
    });
    function deleteRule(index) {
      rules.splice(index, 1);
      if (editingIndex === index) {
        editingIndex = null; // Reset editing index if the currently edited rule is deleted
      }
      rules=rules
      $metadata.rules = rules;
    }
    function cloneRule(index) {
      let rule=rules[index]
      rule=JSON.parse(JSON.stringify(rule))
      rules.push(rule)
      editingIndex=rules.length-1
      $metadata.rules = rules;
    }
    function editRule(index) {
      editingIndex = index;
    }
  </script>
  
  <style>
    .rule-row {
      position: relative;
      padding: 10px;
      border: 1px solid #ccc;
      margin-bottom: 5px;
    }
    .rule-row:hover .edit-button {
      display: block;
    }
    .edit-button {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        color: black;
        background-color: rgb(227, 206, 116);
        border-color: rgb(128, 128, 128);
        border-radius: 5px;
        padding: 5px;
    }
    .close-button {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;

    }    
    .action-row {

    }
    .oneLine {
        display: inline-block;
        margin-right: 10px;
        width:120px;
        font-size: 14px;

    }
    .input {
        background-color: black;
        color: white;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        padding: 3px;
    }
    .rightValue {
        width: 150px;
    }
    .ruleEditor button {
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
    .ruleEditor .delete {
        background-color: red;
        color: white;
    }
    .ruleEditor h1 {
      font-size: 16px;
      margin-bottom: 30px;
    }
  </style>
  

 <div class="ruleEditor">
  <h1>Rules</h1>

  {#each rules as rule, index}
    <div class="rule-row">
      {#if editingIndex === index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="close-button" on:click={() => { editingIndex=-1 }}>X</div>

        <!-- Inputs for editing -->

          <select bind:value={rule.fieldName}  class="oneLine input">
            <option value="">Field...</option>
            <optgroup label="Form">
              {#each fields as field}
                <option value={field.name}>{field.name}</option>
              {/each}
              </optgroup>
              <optgroup label="Defaults">
                {#each mappingFields.defaultFields as field}
                  <option value={field.name}>{field.name}</option>
                {/each}
              </optgroup>
          </select>
          <select bind:value={rule.condition} class="oneLine input">
            <option value="">Condition...</option>
            {#each conditions as condition}
              <option value={condition}>{condition}</option>
            {/each}
          </select>
          <input type="text" class="input rightValue" placeholder="Value" bind:value={rule.rightValue}>

          <select bind:value={rule.actionType}  class="input">
            <option value="">Action...</option>
            <option value="setValue">Set value</option>
            <option value="showField">Show another field</option>
            <option value="hideField">Hide another field</option>
            <option value="copyParameter">Copy parameter from another field</option>
          </select>
        {#if rule.actionType === 'setValue'}
          <div class="action-row">
              <select bind:value={rule.targetField} class="oneLine input">
                <option value="">Field...</option>
                <optgroup label="Form">
                  {#each fields as field}
                    <option value={field.name}>{field.name}</option>
                  {/each}
                </optgroup>
                <optgroup label="Defaults">
                  {#each mappingFields.defaultFields as field}
                    <option value={field.name}>{field.name}</option>
                  {/each}
                </optgroup>
              </select>
              = <InputCombo  bind:value={rule.actionValue} }></InputCombo>
              <!-- <input type="text" bind:value={rule.actionValue} placeholder="Value"  class="oneLine input" style="width:270px">-->
          </div>
        {/if}
        {#if rule.actionType === 'showField' || rule.actionType === 'hideField'}
        <div class="action-row">
          <select bind:value={rule.targetField} class="oneLine input">
            <option value="">Field...</option>
            <optgroup label="Form">              
              {#each fields as field}
                {#if field!==rule.fieldName && field.type!=="layer_image" && field.type!=="magnifier" && field.type!=="advanced_options"}
                  <option value={field.name}>{field.name}</option>
                {/if}
              {/each}
            </optgroup>            
          </select>
          
          <!-- <input type="text" bind:value={rule.actionValue} placeholder="Value"  class="oneLine input" style="width:270px">-->
      </div>
        {/if}
        {#if rule.actionType === 'copyValue' || rule.actionType === 'copyParameter'}
        <div class="action-row"> Copy 
          <select bind:value={rule.actionValue} class="oneLine input">
            <option value="">From Field...</option>
            <optgroup label="Form">              
              {#each fields as field}
                {#if field!==rule.fieldName && field.type!=="layer_image" && field.type!=="magnifier" && field.type!=="advanced_options"}
                  <option value={field.name}>{field.name}</option>
                {/if}
              {/each}
            </optgroup>            
          </select>

          <select bind:value={rule.targetField} class="oneLine input">
            <option value="">To Field...</option>
            <optgroup label="Form">              
              {#each fields as field}
                {#if field!==rule.fieldName && field.type!=="layer_image" && field.type!=="magnifier" && field.type!=="advanced_options"}
                  <option value={field.name}>{field.name}</option>
                {/if}
              {/each}
            </optgroup>            
          </select>
          {#if rule.actionType === 'copyParameter'}
           <input bind:value={rule.targetParameter} class="oneLine input">
          {/if}
          <!-- <input type="text" bind:value={rule.actionValue} placeholder="Value"  class="oneLine input" style="width:270px">-->
      </div>
        {/if}
        <div><button on:click={() => deleteRule(index)} class="delete">Delete</button> <button on:click={() => cloneRule(index)} class="">Clone</button></div>
        

      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if !no_edit}
          <div class="edit-button" on:click={() => editRule(index)}>Edit</div>
        {/if}

        <!-- Display Rule Summary -->
        <div> if {rule.fieldName} {rule.condition} {rule.rightValue}: 
          {#if rule.actionType==="setValue"}set {rule.targetField}={rule.actionValue}{/if}
          {#if rule.actionType==="showField"}show {rule.targetField}{/if}
          {#if rule.actionType==="hideField"}hide {rule.targetField}{/if}
          {#if rule.actionType==="copyValue"}copy {rule.actionValue} to {rule.targetField}{/if}
          {#if rule.actionType==="copyParameter"}copy {rule.actionValue} to {rule.targetField}.{rule.targetParameter}{/if}

        </div>
      {/if}
    </div>
  {/each}
  {#if !no_edit}
      <button on:click={addRule}>Add Rule</button>
  {/if}
</div>
