<script>
    import FormBuilder from "./FormBuilder.svelte"
    import EditModels from "./EditModels.svelte"

    import RuleEditor from "./RuleEditor.svelte"
    import Mappings from "./Mappings.svelte"

    import {writable} from 'svelte/store'
    import {onMount} from 'svelte'
    import {metadata} from './stores/metadata'
    import Icon from './Icon.svelte'
    import { ComfyUIPreparser } from './ComfyUIPreparser.js'
    import { mappingsHelper } from './mappingsHelper.js'
    import { nodesManager } from './nodesManager.js'
    import { modelsManager } from './modelsManager.js'

    let allworkflows;
    let moving = false;
    let left = 10
    let top = 10
    let styleel;
    let loadedworkflow;

    let foldOut = false
    let name = ""   // current loaded workflow name
    let state = "list"
    let tags = ["Txt2Image", "Inpainting", "ControlNet", "LayerMenu", "Deactivated","Img2Img","Default","Other"]
    let workflowList = writable([])    // todo:load all workflow basic data (name, last changed and gyre object) from server via server request
    let workflowapiList= writable([]);
    let workflowdebugList= writable([]);
    let workflowformList= writable([]);
    let activatedTags = {}
    let selectedTag = ""
    let orginalname;
    let duplicate = false
    let debug=false
    let debugmode='errormode'
    let actioniconclicked
    let virtualNodes = []
    let deactivatedworkflows = []
    let allworkflowswithdefaults 

    let allModels=[]
    function onMouseDown() {
        moving = true;
    }

    function onMouseMove(e) {
        if (moving) {
            left += e.movementX;
            top += e.movementY;
        }
    }

    onMount(async () => {
        await getAllModels()

        await loadList();
        await loadLogList();
        addExternalLoadListener();
        await overrideCleanFunction();
        let lastloadedworkflowname = localStorage.getItem("lastgyreworkflowloaded");
        if(lastloadedworkflowname) {
            let current = $workflowList.find((el) => {
                return el.name == lastloadedworkflowname;
            })

            loadWorkflow(current)
            await loadUIComponents();
            await executeJSUIComponents();

        }

    })


    async function overrideCleanFunction() {
        await new Promise(r => setTimeout(r, 100));

        const orgclean = window.app.clean;
        window.app.clean = function () {
            orgclean?.apply(this, arguments);
            if($metadata){
                setTimeout( ()=>{
                    let helper=new mappingsHelper()
                    helper.cleanUpMappings($metadata)
                }, 500);
            }
        }
    }



    function addExternalLoadListener() {
        const fileInput = document.getElementById("comfy-file-input");
        const fileInputListener = async () => {
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                await new Promise(r => setTimeout(r, 500));
                new Date(fileInput.files[0].lastModified).toDateString()
                let fixedfilename = fileInput.files[0].name.replace(".json","");
                fixedfilename = getAvalableFileName(fixedfilename);

                let graph = window.app.graph.serialize();
                graph.name = fixedfilename;
                graph.lastModified = fileInput.files[0].lastModified
                if (!graph.extra?.workspace_info) graph.extra.workspace_info = [];
                graph.extra.workspace_info.name = fixedfilename;
                graph.extra.workspace_info.lastModified = fileInput.files[0].lastModified;
                graph.extra.workspace_info.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];
                if (graph?.extra?.gyre) {
                    graph.gyre = graph?.extra?.gyre;
                }
                if (!graph.extra.gyre) {
                    graph.extra.gyre = {};
                }

                graph.extra.gyre.lastModified = fileInput.files[0].lastModified;
                graph.extra.gyre.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];
                loadedworkflow = graph;
                loadWorkflow(graph);
            }
        };
        fileInput?.addEventListener("change", fileInputListener);
    }
    function getAvalableFileName(name) {
        if (!name) return 'new'
        return name   
    }


    function onMouseUp() {
        moving = false;
    }


    function isVisible(workflow) {
        let mytags = workflow?.gyre?.tags || [];
        for (let activeTag in activatedTags) {
            if (activatedTags[activeTag] && !mytags.includes(activeTag)) return false
        }
        return true
    }

    /**
     * read all logs
     */
    async function loadLogList() {
        // todo: make server request and read $metadata of all existing workflows on filesystem
        let result = await scanLocalNewFiles('logs');
        result = result.sort((a,b) => b.name.replace(/[^0-9]/g,"") - a.name.replace(/[^0-9]/g,""));
        workflowapiList.set(result)


        result = await scanLocalNewFiles('debugs');
        result = result.sort((a,b) => b.name.replace(/[^0-9]/g,"") - a.name.replace(/[^0-9]/g,""));
        workflowdebugList.set(result);

        result = await scanLocalNewFiles('formdata');
        result = result.sort((a,b) => b.name.replace(/[^0-9]/g,"") - a.name.replace(/[^0-9]/g,""));
        workflowformList.set(result);

        result = await scanLocalNewFiles('deactivatedworkflows');
        console.log("result",result);
        if(result.length){
            deactivatedworkflows =  JSON.parse(result[0].json);
        }
    }




    /**
     * read all workflows
     */
    async function loadList() {
        // todo: make server request and read $metadata of all existing workflows on filesystem
        let result = await scanLocalNewFiles()
        let resultdefaults = await scanLocalNewFiles('defaults');
        resultdefaults = resultdefaults.map((el) => {
            let jsn = JSON.parse(el.json);
            jsn.extra.gyre.tags.push("Default");
            el.json = JSON.stringify(jsn);
            let res = {defaultworkflow:true,...el}
            return res
        })
        result = [...resultdefaults,...result];

        let data_workflow_list = result.map((el) => {
            let res = {name: el.name}
            if(el.defaultworkflow)  res.defaultworkflow = true
            let gyre = null
            if (el.json) gyre = JSON.parse(el.json).extra.gyre
            res.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || ""
            res.json = el.json
            res.missingNodes=el.missingNodes
            res.missingModels=el.missingModels
            if (gyre) {
                res.gyre = gyre
                res.gyre.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || ""
                res.gyre.lastModified = JSON.parse(el.json).extra.gyre?.lastModified || ""
                if(!res.gyre.workflowid) res.gyre.workflowid =  (Math.random() + 1).toString(36).substring(2)
            }
            return res
        })

        workflowList.set(data_workflow_list)
    }

    let custom_ui_components
    /**
     * get list with all UI components
     */
    async function loadUIComponents() {
        custom_ui_components = await getListFromServer()
       // console.log("COMPONENTS",custom_ui_components)
    }

    async function executeJSUIComponents() {
        custom_ui_components.forEach((el)=>{
            addJSScript(el.js_path);
        })
        // console.log("COMPONENTS",custom_ui_components)
    }

    function addJSScript(extensionName){
        let src= location.origin+'/gyre_extensions/'+'gyre-extensions/'+extensionName;
        let script=window.document.createElement("script")
        script.async = false
        script.src=src
        document.head.appendChild(script)
    }



    /**
     * get list of all installed models
     */
     async function getAllModels() {
        let res = await getListFromServer("/gyre/get_all_models","GET")
        if (res) allModels=res.models
 //       console.log("All models",allModels)
    }



    async function updateDeactivatedDefaultWorkflows() {
        try {
            const response = await fetch(`/gyre/upload_log_json_file`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: 'deactivatedworkflows.json',
                    json_str: JSON.stringify(deactivatedworkflows),
                    debugdir:'deactivatedworkflows'
                }),
            });
        } catch (error) {
            alert("Error saving workflow .json file: " + error);
            console.error("Error saving workspace:", error);
        }
    }



    async function scanLocalNewFiles(type) {
        let existFlowIds = [];
        try {
            const response = await fetch("/gyre/readworkflowdir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    path: "",
                    existFlowIds,
                    type
                }),
            });

            let result = await response.json();
            if(type!='logs' && type!='debugs' && type!='formdata' && type!='deactivatedworkflows') {
                result = fixDatesFromServer(result);
                if(type!='defaults'){
                    allworkflows = result;
                }           
                markWorkflowsWithMissingNodesAndModels(result)
                allworkflowswithdefaults = result
            }
            return result;
        } catch (error) {
            console.error("Error scan local new files:", error);
        }
    }

    function markWorkflowsWithMissingNodesAndModels(list) {
        let nm=new nodesManager()
        let mm=new modelsManager(allModels)
        for(let i=0;i<list.length;i++) {
            let entry=list[i]
            if (entry.json) {
                let workflow=JSON.parse(entry.json)
                let res=nm.checkMissingNodes(workflow)
                if (!res) entry.missingNodes=true
                res=mm.checkMissingModels(workflow)
                if (!res) entry.missingModels=true
            }
        }
    }
    async function getListFromServer(endpoint="/gyre/collect_gyre_components",method="POST") {
        let response
        try {
            if (method==="GET") {
                response = await fetch(endpoint)
                
            } else {
                response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        path: ""
                    }),
                });                
            }


            let result = await response.json();        
            return result;
        } catch (error) {
            console.error("Error getListFromServer:",endpoint, error);
        }
    }


    function fixDatesFromServer(result) {
        let newel = result.map((el) => {
            let objjs = JSON.parse(el.json);
            objjs.extra.gyre.lastModified = new Date(el.lastmodified * 1000).getTime();
            let datestr = new Date(el.lastmodified * 1000).toISOString();
            objjs.extra.gyre.lastModifiedReadable = datestr.split('T')[0] + " " + datestr.split('T')[1].replace(/\.[^/.]+$/, "");
            let json = JSON.stringify(objjs);
            return {...el, json}
        })
        return newel;
    }


    async function loadWorkflow(workflow,e) {

      if(actioniconclicked){
          actioniconclicked = false;
          return;
      }
        await loadList()
        if (!workflow) return
        if (!workflow.gyre) {
            workflow.gyre = {};
            workflow.gyre.tags = [];
        }
        orginalname = workflow.name;
      //  console.log("load workflow!!",orginalname,workflow.name);
        name = workflow.name
        $metadata = workflow.gyre        
        if (!$metadata.tags) $metadata.tags=[]
        if (window.app.graph == null) {
            console.error("app.graph is null cannot load workflow");
            return;
        }
        if (window.gyreClearAllComboValues) window.gyreClearAllComboValues()

        let current = allworkflowswithdefaults.find((el) => {
            return el.name == workflow.name;
        })

        if (state=="errorlogs"){


            if (debugmode=='errormode') {
                current = $workflowapiList.find((el) => {
                    return el.name == workflow.name;
                })
                window.app.loadApiJson(JSON.parse(current.json));
                state = "errorlogs"
                return;
            }
            if (debugmode=='debugmode'){
                current = $workflowdebugList.find((el) => {
                    return el.name == workflow.name;
                })
                let wf = JSON.parse(current.json);
                window.app.loadGraphData(wf);
                state="errorlogs"
                return;
            }


        }
        localStorage.setItem('lastgyreworkflowloaded',workflow.name);

            let wf = null;
            if (loadedworkflow) {
                wf = loadedworkflow;
                loadedworkflow = null;
                current = null;
            }


            if (!current) {

                if(!wf) wf = JSON.parse(workflow.json);
                if (!wf.name && name) wf.name = name;
                window.app.loadGraphData(wf);
                //window.app.loadGraphData(workflow);
            } else {
                wf = JSON.parse(current.json);
                if (!wf.name && name) wf.name = name;
                window.app.loadGraphData(wf);
            }

        state="properties"
     }


    async function  testFirstPass() {
        let workflow=window.app.graph.serialize()
        workflow=JSON.parse(JSON.stringify(workflow))
        console.log(workflow)
//        let loop=new loopPreparser(workflow)
//        loop.generateLoop("controlnet",3)
//        console.log(workflow)
        let parser=new ComfyUIPreparser(workflow)
        await parser.execute(parser.getTestData())
        window.app.loadGraphData(workflow);
        $metadata=workflow.extra.gyre
    }
    function showStructure() {
        let workflow=window.app.graph.serialize()
        console.log(workflow)
    }

    async function getVirtualNodes() {
        for (const outerNode of  window.app.graph.computeExecutionOrder(false)) {
            const innerNodes = outerNode.getInnerNodes ? outerNode.getInnerNodes() : [outerNode];
            for (const node of innerNodes) {
                if (node.isVirtualNode) {
                    virtualNodes.push(node.type);
                }
            }
        }
    }


    async function saveWorkflow() {
    //    console.log("saveWorkflow");
        let helper=new mappingsHelper()
        helper.cleanUpMappings($metadata)
        getVirtualNodes();
        window.app.graph.serialize_widgets=true
        let graph = window.app.graph.serialize();

        //if (!$metadata.virtualNodes || ($metadata.virtualNodes && !$metadata.virtualNodes.length)){
            virtualNodes= [...new Set(virtualNodes)];
            $metadata.virtualNodes=virtualNodes;
        //}
        for(let i=0;i<graph.nodes.length;i++) {
            let node=graph.nodes[i]
            let _node=window.app.graph._nodes[i]
            if (!$metadata.nodeWidgets) $metadata.nodeWidgets={}
            // remove image list from values
            if  (_node && _node.widgets!=void 0) {
                let newwidgets = JSON.parse(JSON.stringify(_node.widgets));
                newwidgets.forEach((el) => {
                    if (el.name == 'image') {
                        el.options.values = [];
                    }
                })
                $metadata.nodeWidgets[node.id] = newwidgets;
            }
         //   node.widgets=_node.widgets
        }

        
        // this is scenario just after loading workflow and not save it
        if (loadedworkflow && loadedworkflow.extra.workspace_info) {
            graph.extra = loadedworkflow.extra;
            $metadata = loadedworkflow.extra.gyre;
        }
        loadedworkflow = null;
        let file_path = graph.extra?.workspace_info?.name || "new.json";
        if (name) {
            file_path = name
        }
        // console.log("save file: ",file_path,"name: ",name,"gyrename: ",graph.extra?.workspace_info?.name);

        if (!file_path.endsWith('.json')) {
            // Add .json extension if it doesn't exist
            file_path += '.json';
        }
        if ($metadata && graph.extra) graph.extra.gyre = $metadata;
        const graphJson = JSON.stringify(graph);

        if(orginalname != name && !duplicate) {
            let new_file_path;
            if (orginalname) {
                new_file_path = orginalname
            }
            if (!new_file_path.endsWith('.json')) {
                new_file_path += '.json';
            }
            await updateFile(new_file_path, graphJson);
            await renameFile(new_file_path,file_path)
            duplicate = false;
            orginalname = name;
        } else{
            await updateFile(file_path, graphJson);
            if(duplicate){
                orginalname = name;
                duplicate = false;
            }
        }
        await loadList();
    }




    async function renameFile(file_path, new_file_path) {
        try {
            const response = await fetch("/gyre/rename_workflowfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: file_path,
                    new_file_path: new_file_path,
                }),
            });
            const result = await response.text();
            return result;
        } catch (error) {
            alert("Error rename .json file: " + error);
            console.error("Error rename workspace:", error);
        }
    }

    async function updateFile(file_path, jsonData) {
        try {
            const response = await fetch("/gyre/update_json_file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: file_path,
                    json_str: jsonData,
                }),
            });
            const result = await response.text();
            return result;
        } catch (error) {
            alert("Error saving workflow .json file: " + error);
            console.error("Error saving workspace:", error);
        }
    }

    async function deleteFile(file_path) {
        try {
            const response = await fetch("/gyre/delete_workflow_file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: file_path,
                }),
            });
            const result = await response.text();
            return result;
        } catch (error) {
            alert("Error delete workflow .json file: " + error);
            console.error("Error saving workspace:", error);
        }
    }


    function addTag() {
        if (!selectedTag) return
        if (!$metadata.tags) $metadata.tags = []
        if (selectedTag==="LayerMenu") {
            removeTag("ControlNet")
            removeTag("Txt2Image")
            removeTag("Inpainting")
        } 
        if (selectedTag==="Txt2Image" || selectedTag==="Inpainting" || selectedTag==="ControlNet") {
            removeTag("LayerMenu")
        }
        $metadata.tags.push(selectedTag)
        $metadata = $metadata
    }

    function removeTag(tag) {
        const index = $metadata.tags.indexOf(tag)
        if (index<0) return
        $metadata.tags.splice(index, 1);
        $metadata = $metadata
    }
    function deleteWorkflow(workflow) {
        if (confirm("Delete Workflow?") == true) {
            let name = workflow.name;
            if (!name.endsWith('.json')) {
                name += '.json';
            }
            deleteFile(name);
            $workflowList=$workflowList
        }
    }
    function duplicateWorkflow() {
        name = 'Copy of '+name;
        $metadata.workflowid = (Math.random() + 1).toString(36).substring(2);
            $metadata.tags = $metadata.tags.filter((el) => el != 'Default');
            removeTag('Default');
        duplicate = true;
        saveWorkflow();
        localStorage.setItem('lastgyreworkflowloaded',name);
    }


    let refresh=0
    function updateForm() {
        if (state!=="editForm") return
        refresh++

    }
    function refreshTags(e) {
        $metadata.tags=e.detail
    }

    function download(text) {
        var element = document.createElement('a');
        element.setAttribute('href',
            'data:text/plain;charset=utf-8, '
            + encodeURIComponent(text));
        element.setAttribute('download', 'formdata.json');
        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
    }


    function loadWorkflowForm(element){
        let elem = $workflowformList.find((el)=>{return el.name=='formdata_'+element.name});
        download(elem.json);
    }
    async function changeActiveDeafaultWorkflow(element,type){
        console.log("element",element);
        actioniconclicked = true;
        if(type=='deactivate'){
            deactivatedworkflows.push(element.gyre.workflowid);
        } else {
            deactivatedworkflows = deactivatedworkflows.filter((el)=>el!=element.gyre.workflowid);
        }
        await updateDeactivatedDefaultWorkflows();
        $workflowList = $workflowList;
    }


    let searchQuery=""
</script>

<div id="workflowManager" class="workflowManager" style="left: {left}px; top: {top}px;">
  <div class="miniMenu">
            <div class="moveIcon">
                <Icon name="move" on:mousedown={onMouseDown}></Icon>
            </div>
            <div class="title">

                {#if !name}
                    <Icon name="Gyre" class="gyreLogo"></Icon>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={(e) => {foldOut=true}} style="display:inline-block">Gyre</div>
                {:else}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={(e) => {foldOut=true}} style="display:inline-block">{name}</div>
                    {#if  !$metadata.tags.includes('Default')}
                        <div style="display: inline-block" class="saveIcon">
                            <Icon name="save" on:click={(e) => {saveWorkflow()}} ></Icon>
                        </div>
                    {/if}
                {/if}
            </div>

        </div>
    {#if !foldOut}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="foldout" on:click={(e) => {foldOut=true}}>
                <Icon name="down"></Icon>
            </div>
    {/if}
    {#if foldOut}
    {#if debug}
 <button on:click={(e) => { testFirstPass()} }>Test</button>
 <button on:click={(e) => { showStructure()} }>WF JSON</button>
{/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="foldout" on:click={(e) => {foldOut=false}}>
            <Icon name="up"></Icon>
        </div>
        <div class="main">
        <div class="leftMenu">
            {#key state}
                <Icon name="list" {state} on:click={ (e) =>  {state="list" }} ></Icon>
                {#if $metadata && $metadata.lastModified}
                    <Icon name="properties" {state} on:click={async (e) =>  {state="properties" }}  ></Icon>
                    <Icon name="editForm" {state} on:click={async (e) =>  {state="editForm" }}  ></Icon>
                    <Icon name="editRules" {state} on:click={async (e) =>  {state="editRules" }}  ></Icon>
                    <Icon name="errorlogs" {state} on:click={async (e) =>  {await loadLogList(); state="errorlogs" }}  ></Icon>
                {:else}
                    <Icon name="properties" deactivate="deactivate"  ></Icon>
                    <Icon name="editForm"   deactivate="deactivate" ></Icon>
                    <Icon name="editRules"   deactivate="deactivate"></Icon>
                    <Icon name="errorlogs" {state} on:click={async (e) =>  {await loadLogList(); state="errorlogs" }}  ></Icon>
                {/if}
                <a href="gyreapp/dist/index.html" target="_blank">
                <Icon name="GyreLeftMenu"></Icon>
                </a>
            {/key}
        </div>
        <div class="content">

            {#if state === "properties"}
                <h1>Workflow Properties</h1>
                
                {#if  !$metadata.tags.includes('Default')}
                    <label for="name">Name:</label>
                    <input name="name" type="text" bind:value={name} class="text_input">
                {:else}
                    <div style="margin-bottom:10px"> {name} </div>
                   
                {/if}
                {#if name}
                    <button on:click={(e) => { duplicateWorkflow()} }>Duplicate Workflow</button>
                {/if}
                <div class="tagedit">
                    {#if  !$metadata.tags.includes('Default')}<div class="tagTitle">Click on a Tag to remove it</div>{/if}
                    <div class="tags">
                        {#if $metadata.tags}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            {#each $metadata.tags as tag}
                                {#if  !$metadata.tags.includes('Default')}
                                    <div class="tag" on:click={(e) => {removeTag(tag)}}>{tag}</div>
                                {:else}
                                    <div class="tag">{tag}</div>
                                {/if}
                            {/each}
                        {/if}
                    </div>
                    {#if  !$metadata.tags.includes('Default')}
                        <select class="tagselect" bind:value={selectedTag} on:change={(e) => {addTag()}}>
                            <option selected value="">Add Tag...</option>
                            {#each tags as tag}
                                {#if $metadata.tags && !$metadata.tags.includes(tag)}
                                    <option value="{tag}">{tag}</option>
                                {/if}
                            {/each}
                        </select>
                    {/if}
                </div>      
                         
                 {#if  !$metadata.tags.includes('Default')}

                    <label for="license">License:</label>
                    <select class="input license" name="license" bind:value={$metadata.license}>
                        <option selected value="">Select...</option>
                        <option selected value="yes_commercial">Commercial allowed</option>
                        <option selected value="non_commercial">Non Commercial</option>
                        <option selected value="needs_license">Needs license for Commercial use</option>
                    </select>
                {:else if $metadata.license}License: {$metadata.license}
                {/if}
                <div class="inputLine" >    
                    {#if  !$metadata.tags.includes('Default')}
                
                    <label for="description" style="vertical-align:top">Description:</label>
                       <textarea class="text_input" bind:value={$metadata.description}></textarea>                    
                    {:else}
                        {$metadata.description}
                    {/if}
                </div>

                <div class="inputLine" >
                    {#if  !$metadata.tags.includes('Default')}
                    <label for="youtube" style="vertical-align:top">YouTube:</label>
                         <input type="text" name="youtube" class="text_input" bind:value={$metadata.youtube}>          
                    {:else if $metadata.youtube}
                         <a href="{$metadata.youtube}" target="_blank">YouTube</a>"
                    {/if}       
                </div>                

                <div class="inputLine" >
                    {#if  !$metadata.tags.includes('Default')}
                    <label for="category" style="vertical-align:top">Category (only layer menu):</label>
                         <input type="text" class="text_input" bind:value={$metadata.category}>          
                    {:else if $metadata.category}
                        Layer menu category: {$metadata.category}
                    {/if}       
                </div>                
                <EditModels availableModels={allModels} no_edit={$metadata.tags.includes('Default')} on:downloadFinished={getAllModels}></EditModels>
                {#if $metadata.workflowid}ID: {$metadata.workflowid}{/if}

            {/if}
            {#if state === "editForm"}
                <div style="margin-top:10px"></div>
                <FormBuilder availableModels={allModels} {refresh} {custom_ui_components} on:refreshTags={(e)=>{ refreshTags(e)}} posX={parseInt(left)} posY={parseInt(top)} no_edit={$metadata.tags.includes('Default')}></FormBuilder>
            {/if}
            {#if state === "editRules"}
                <div style="margin-top:10px"></div>
                {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}
                    <RuleEditor no_edit={$metadata.tags.includes('Default')}></RuleEditor>
                {:else}
                    Please define a form first
                {/if}
            {/if}
            {#if state === "list"}
                <div class="header-container">
                    <h1>Workflow List</h1> <input type="text" placeholder="Search" bind:value={searchQuery} class="searchQuery">
                </div>
                <div class="tags">
                    {#each tags as tag}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="tag"
                            on:click={ (e) => { activatedTags[tag]=!activatedTags[tag];$workflowList=$workflowList}}
                            class:on={activatedTags[tag]}>{tag}</div>
                    {/each}
                </div>
                {#if workflowList}
                    {#each $workflowList as workflow}
                        {#if !searchQuery || workflow.name.toLowerCase().includes(searchQuery.toLowerCase())}
                            {#if isVisible(workflow)}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div style="position: relative" class="workflowEntry" on:click={(e)=>{loadWorkflow(workflow,e)}}>
                                    <div class={(workflow.missingNodes || workflow.missingModels) ? 'missingNodesOrModels' : ''}> {workflow.name}</div>
                                    <div class="last_changed">{workflow.lastModifiedReadable}</div>
                                    <div class="tags">
                                        {#if workflow.gyre && workflow.gyre.tags}
                                            {#each workflow.gyre.tags as tag}
                                                <div class="tag">{tag}</div>
                                            {/each}
                                        {/if}
                                    </div>
                                    {#if !workflow.defaultworkflow}
                                        <div  class="deleteicon">
                                            <Icon name="delete" on:click={(e)=>{deleteWorkflow(workflow)}}></Icon>
                                        </div>
                                    {/if}

                                    {#if workflow.defaultworkflow}

                                        {#if deactivatedworkflows.includes(workflow.gyre.workflowid)}
                                            <div  class="deleteicon">
                                                <Icon name="activateback" on:click={async (e) => {await changeActiveDeafaultWorkflow(workflow,"activate")}} ></Icon>
                                            </div>
                                            
                                            {:else}
                                            <div  class="deleteicon">
                                                <Icon name="deactivated" on:click= {async (e) => {await changeActiveDeafaultWorkflow(workflow,"deactivate")}} ></Icon>
                                            </div>

                                        {/if}
                                    {/if}



                                </div>
                            {/if}
                        {/if}
                    {/each}
                {/if}

            {/if}

            {#if state === "errorlogs"}
                {#if debugmode=='errormode'}
                    <h1>Error logs</h1>
                {:else}
                    <h1>Debug logs</h1>
                {/if}
                <button  class:inactive={debugmode!='errormode'} on:click={async (e) => {await loadLogList(); debugmode='errormode'} }>Error Log</button>
                <button class:inactive={debugmode!='debugmode'} on:click={async (e) => {await loadLogList(); debugmode='debugmode'} }>Debug Log</button>

                {#if debugmode=='errormode'}
                    {#if workflowList}
                        {#each $workflowapiList as workflow}
                            {#if isVisible(workflow)}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div style="position: relative" class="workflowEntry" on:click={loadWorkflow(workflow)}>
                                    {workflow.name}
                                </div>
                            {/if}
                        {/each}
                    {/if}
                {/if}

                {#if debugmode=='debugmode'}
                        {#each $workflowdebugList as workflow}
                            {#if isVisible(workflow)}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div style="position: relative" class="workflowEntry" on:click={loadWorkflow(workflow)}>
                                    {workflow.name}
                                </div>
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div style="position: relative" class="workflowEntry" on:click={loadWorkflowForm(workflow)}>
                                    Form data {workflow.name}
                                </div>
                            {/if}
                        {/each}
                {/if}
            {/if}

        </div>
    </div>
    {/if} <!-- foldOut -->
</div>
<Mappings on:updateForm={(e) => {updateForm()}} ></Mappings>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove}/>
 
<style>
    @import 'dist/build/gyrestyles.css';
</style>