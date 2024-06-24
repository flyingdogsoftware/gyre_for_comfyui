
<script>
    import { createEventDispatcher } from 'svelte'
    import Icon from './Icon.svelte'
    import fieldTypes  from './form_templates/fieldTypes.json'

    export let custom_ui_components
    const dispatch = createEventDispatcher()
    let showFieldSelector="none"
    
    let left="100px"
    let top="100px"
    export function openDialog(e,posX,posY) {
        showFieldSelector="block"
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
        showFieldSelector="none"
    }
    function findFieldByType(type) {
        for(let i=0;i<fieldTypes.length;i++) {
            let field=fieldTypes[i]
            if (field.menu_type===type) {
                field=JSON.parse(JSON.stringify(field))
                field.menu_type=null
                return field
            }
            if (field.type===type) return field
        }
    }
    function selectElement(type,customElement=null) {
        if (customElement) {
            customElement.custom=true
            dispatch('select', customElement)
            return
        }
        let field=findFieldByType(type)
        if (!field) {
            alert("field type "+type+" not found")
            return
        }
        dispatch('select', field)
    }   
    </script>
    <style>
        #fieldSelector {
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
        #fieldSelector h1 {
            font-size: 16px;
            margin:0 ;
            margin-bottom: 10px;
        }
        .field {
            cursor: pointer;
            padding: 5px;
            background-color:  rgb(60, 60, 60);
            width: 200px;
            display: inline-block;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .field:hover {
            background-color: rgb(227, 206, 116);
            color: black;
            fill: black;
        }
        .field span {
            font-size: 16px;
            margin-left: 20px;
            vertical-align: 10px;
        }
        </style>


<div id="fieldSelector" style="display:{showFieldSelector};left:{left};top:{top}" >
    <h1>Add Form Field</h1>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="field" on:click={(e) => { selectElement("text")}}>
        <Icon name="form_text" ></Icon><span>Text</span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("textarea")}}>
        <Icon name="form_textarea" ></Icon><span>Textarea</span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("checkbox")}}>
        <Icon name="form_checkbox" ></Icon><span>Switch</span>
    </div>  
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("dropdown")}}>
        <Icon name="form_dropdown" ></Icon><span>Select</span>
    </div>  
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("pre_filled_dropdown")}}>
        <Icon name="form_dropdown" ></Icon><span>Autofill Select</span>
    </div>      
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("slider")}}>
        <Icon name="form_slider" ></Icon><span>Slider</span>
    </div>     
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field"  on:click={(e) => {selectElement("number")}}>
        <Icon name="form_text"></Icon><span>Number</span>
    </div>     
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="field" on:click={(e) => { selectElement("color_picker")}}>
        <Icon name="form_colorpicker" ></Icon><span>Color Picker</span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="field" on:click={(e) => { selectElement("text_output")}}>
        <Icon name="form_text_output" ></Icon><span>Text Output</span>
    </div>    
    <h1>Special fields</h1>
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field"  on:click={(e) => {selectElement("layer_image")}}>
        <Icon name="form_layers"></Icon><span>Layer Image</span>
    </div>     
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field"  on:click={(e) => {selectElement("drop_layers")}}>
        <Icon name="form_layers"></Icon><span>Drop Layers</span>
    </div>        
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("currentLayer")}}>
        <Icon name="form_layers2" ></Icon><span>Selected Layer</span>
    </div>        
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("Preview")}}>
        <Icon name="form_preview" ></Icon><span>Preview</span>
    </div>   
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("magnifier")}}>
        <Icon name="form_magnifier" ></Icon><span>Magnifier</span>
    </div>     
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("addLayer")}}>
        <Icon name="form_layers3" ></Icon><span>Add Layer</span>
    </div>         
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("advanced_options")}}>
        <Icon name="form_advanced" ></Icon><span>Advanced Options</span>
    </div>           
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("numberImages")}}>
        <Icon name="form_slider" ></Icon><span># Result Images</span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("Seed")}}>
        <Icon name="form_text" ></Icon><span>Seed</span>
    </div>   
    <!-- svelte-ignore a11y-click-events-have-key-events -->    
    <div class="field" on:click={(e) => {selectElement("file")}}>
        <Icon name="form_file" ></Icon><span>Internal File</span>
    </div>      
    <h1>From Extensions</h1>       
    {#each custom_ui_components as ui_element}
            <!-- svelte-ignore a11y-click-events-have-key-events -->    
            <div class="field" on:click={(e) => {selectElement(ui_element.tag,ui_element)}}>
                {#if ui_element.icon}<Icon svg={ui_element.icon} ></Icon>{/if}<span>{ui_element.name}</span>
            </div> 
    {/each}
</div>
