import asyncio
import server
from aiohttp import web
import aiohttp
import requests
import folder_paths
import shutil
import os
import sys
import threading
import subprocess  # don't remove this
from urllib.parse import urlparse
import subprocess
import os
import json
from .nodes import *
import mimetypes
import zipfile
import io
import shutil
import pickle

WEB_DIRECTORY = "entry"
DEFAULT_USER = "guest"
# NODE_CLASS_MAPPINGS = {}
__all__ = ['NODE_CLASS_MAPPINGS']
version = "V1.0.0"

print(f"### Loading: Gyre ({version})")
workspace_path = os.path.join(os.path.dirname(__file__))
comfy_path = os.path.join(os.path.dirname(folder_paths.__file__),"gyre_files")
# Create the directory if it doesn't exist
os.makedirs(comfy_path, exist_ok=True)

db_dir_path = os.path.join(workspace_path, "db")

workspace_app = web.Application()

dist_path = os.path.join(workspace_path, 'dist/build')
gyre_path = os.path.join(workspace_path, 'gyre')
if os.path.exists(dist_path):
    workspace_app.add_routes([
        web.static("/", dist_path),
    ])

server.PromptServer.instance.app.add_subapp("/dist/build/", workspace_app)

#mimetypes.types_map['.ts'] = 'application/javascript; charset=utf-8'

async def handler(request):
    return web.FileResponse(os.path.join(workspace_path, "dist\index.html"))


gyre_app = web.Application()
my_path = os.path.join(workspace_path, 'dist')
if os.path.exists(my_path):
    gyre_app.add_routes([
        web.static("/", my_path),
        web.get('/', handler)
    ])

server.PromptServer.instance.app.add_subapp("/dist/", gyre_app)



def get_my_workflows_dir():
    return os.path.join(comfy_path, 'workflows')

def get_my_default_workflows_dir():
    return os.path.join(workspace_path, 'gyre_default_workflows')


def get_my_log_dir():
    return os.path.join(comfy_path, 'logs')

def get_my_debug_dir():
    return os.path.join(comfy_path, 'debug')

def get_my_formdata_dir():
    return os.path.join(comfy_path, 'formdata')

def get_my_deactivatedworkflows_dir():
    return os.path.join(comfy_path, '')



@server.PromptServer.instance.routes.post("/gyre/update_json_file")
async def update_json_file(request):
    data = await request.json()
    file_path = data['file_path']
    json_str = data['json_str']

    def write_json_to_file(json_str):
        my_workflows_dir = get_my_workflows_dir()
        full_path = os.path.join(my_workflows_dir, file_path)
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as file:
            file.write(json_str)

    # Offload the file update to a separate thread
    await asyncio.to_thread(write_json_to_file, json_str)
    return web.Response(text="File updated successfully")

def file_handle(name, file, existFlowIds, fileList,lastmodified):
    json_data = json.load(file)
    workflowid = None
    if 'extra' in json_data and 'gyre' in json_data['extra'] and 'workflowid' in json_data['extra']['gyre']:
        workflowid = json_data['extra']['gyre']['workflowid']
    fileInfo = {
        'json': json.dumps(json_data),
        'name': '.'.join(name.split('.')[:-1]),
        'id': workflowid,
        'lastmodified':lastmodified
    }
    if 'extra' in json_data and 'workspace_info' in json_data['extra'] and 'id' in json_data['extra']['workspace_info']:
        if json_data['extra']['workspace_info']['id'] not in existFlowIds:
            fileList.append(fileInfo)
    else:
        fileList.append(fileInfo)





def folder_handle(path, existFlowIds):
    fileList = []
    # Create the directory if it doesn't exist
    #my_workflows_dir = get_my_workflows_dir()
    #full_path = os.path.join(my_workflows_dir, file_path)
    os.makedirs(path, exist_ok=True)
    #my_workflows_dir = get_my_workflows_dir()
    #os.makedirs(os.path.dirname(my_workflows_dir), exist_ok=True)
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isfile(item_path) and item_path.endswith('.json'):
            lastmodified = os.path.getmtime(item_path)
            with open(item_path, 'r', encoding='utf-8') as f:
                file_handle(item, f, existFlowIds, fileList,lastmodified)

        elif os.path.isdir(item_path):
            fileList.append({
                'name': item,
                'list': folder_handle(item_path, existFlowIds)
            })
    return fileList



def load_file(path,file):
    fileList = []
    existFlowIds = []
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isfile(item_path) and item_path.endswith(file+".json"):
            lastmodified = os.path.getmtime(item_path)
            with open(item_path, 'r', encoding='utf-8') as f:
                file_handle(item, f, existFlowIds, fileList,lastmodified)
    return fileList



# Scan all files and subfolders in the local save directory.
# For files, compare the extra.workspace_info.id in the json format file with the flow of the current DB to determine whether it is a flow that needs to be added;
# For subfolders, scan the json files in the subfolder and use the same processing method as the file to determine whether it is a flow that needs to be added;
@server.PromptServer.instance.routes.post("/gyre/readworkflowdir")
async def readworkflowdir(request):
    reqJson = await request.json()
    deactivateListFile = None
    type = None
    if ('type' in reqJson): type = reqJson['type']
    path = None
    existFlowIds = reqJson['existFlowIds']
    if (type and type=='logs'):
        path = get_my_log_dir()
    elif  (type and type=='debugs'):
        path = get_my_debug_dir()
    elif  (type and type=='formdata'):
        path = get_my_formdata_dir()
    elif  (type and type=='deactivatedworkflows'):
        path = get_my_deactivatedworkflows_dir()
        deactivateListFile = load_file(path,'deactivatedworkflows')
    elif  (type and type=='defaults'):
        path = get_my_default_workflows_dir()
    else:
        path = get_my_workflows_dir()

    if deactivateListFile:
        fileList = deactivateListFile
    else:
        fileList = folder_handle(path, existFlowIds)

    return web.Response(text=json.dumps(fileList), content_type='application/json')





@server.PromptServer.instance.routes.get("/gyre/readworkflowdir")
async def readworkflowdir(request):
    path = get_my_workflows_dir()
    pathdefault = get_my_default_workflows_dir()
    deactivateddir = get_my_deactivatedworkflows_dir()
    fileList = folder_handle(path, [])
    fileListdefault = folder_handle(pathdefault, [])
    deactivated = load_file(deactivateddir,'deactivatedworkflows')
    res = [fileList + fileListdefault + deactivated]
    return web.Response(text=json.dumps(res[0]), content_type='application/json')




@server.PromptServer.instance.routes.post("/gyre/delete_workflow_file")
async def delete_workflow_file(request):
    data = await request.json()
    file_path = data['file_path']

    def delete_file_sync(file_path):
        my_workflows_dir = get_my_workflows_dir()
        full_path = os.path.join(my_workflows_dir, file_path)

        if os.path.exists(full_path):
            os.remove(full_path)
            directory = os.path.dirname(full_path)
            return "Deleted success"
        else:
            return "File was not found"

    response_text = await asyncio.to_thread(delete_file_sync, file_path)

    if response_text == "File not found":
        return web.Response(text=response_text, status=404)
    else:
        return web.Response(text=response_text)

@server.PromptServer.instance.routes.post("/gyre/rename_workflowfile")
async def rename_workflowfile(request):
    data = await request.json()
    file_path = data['file_path']
    new_name = data['new_file_path']
    path = get_my_workflows_dir()

    file_path_full = os.path.join(path, file_path)
    new_name_path_full = os.path.join(path, new_name)

    if os.path.exists(file_path_full):
        os.rename(file_path_full,new_name_path_full)
        return web.Response(text="Renamed successfully")
    else:
        return web.Response(text="Not found", status=404)


@server.PromptServer.instance.routes.post("/gyre/upload_log_json_file")
async def upload_log_json_file(request):
    data = await request.json()
    file_path = data['file_path']
    json_str = data['json_str']
    debug_dir = None
    if ('debugdir' in data): debug_dir = data['debugdir']

    def write_json_to_file(json_str,debug_dir):

        if debug_dir and debug_dir=='formdata':
            my_workflows_dir = get_my_formdata_dir()
        elif debug_dir and debug_dir=='deactivatedworkflows':
            my_workflows_dir = get_my_deactivatedworkflows_dir()

        elif debug_dir:
            my_workflows_dir = get_my_debug_dir()
        else:
            my_workflows_dir = get_my_log_dir()

        full_path = os.path.join(my_workflows_dir, file_path)
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as file:
            file.write(json_str)

    # Offload the file update to a separate thread
    await asyncio.to_thread(write_json_to_file, json_str,debug_dir)
    return web.Response(text="File log updated successfully")


def collect_gyre_components():
    """
    Scans sibling directories for 'entry' subfolders containing both 'gyre_init.js' and 'gyre_ui_components.json',
    reads the JSON file and adds components with additional information to a list.
    
    Returns:
        list of dictionaries: Each dictionary includes copyright, component name, component tag, and path.
    """
    # Get the current script's directory
    current_dir = os.path.dirname(__file__)

    # Get the parent directory (../ of current folder)
    parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))

    # List all subdirectories at the same level as the current script's parent directory
    subdirs = [d for d in os.listdir(parent_dir) if os.path.isdir(os.path.join(parent_dir, d))]

    components_list = []
    debug_list = []
    # Iterate over each subdirectory
    for subdir in subdirs:
        # Path to the 'entry' subfolder
        entry_folder_path = os.path.join(parent_dir, subdir, 'gyre_entry')    
        subdir_name = os.path.basename(subdir)

      
        # Check if 'gyre_entry' subfolder exists
        if os.path.exists(entry_folder_path):  
            # Check if 'gyre_init.js' and 'gyre_ui_components.json' files exist
            gyre_init_js_path = os.path.join(entry_folder_path, 'gyre_init.js')
            gyre_ui_components_json_path = os.path.join(entry_folder_path, 'gyre_ui_components.json')
            if os.path.exists(gyre_init_js_path) and os.path.exists(gyre_ui_components_json_path):
                
                #relative_path = os.path.relpath(entry_folder_path, parent_dir)
                #relative_path = os.path.relpath(subdir, parent_dir).replace('\\', '/')

                # Read the JSON file
                with open(gyre_ui_components_json_path, 'r') as json_file:
                    gyre_ui_data = json.load(json_file)
                debug_list.append(gyre_ui_data)

                # Check if the components key exists in the JSON data
                if 'components' in gyre_ui_data and isinstance(gyre_ui_data['components'], list):
                    
                    # Add copyright information and path to components
                    for component in gyre_ui_data['components']:
                        component_info = {
                            'copyright': gyre_ui_data.get('copyright', 'Unknown'),
                            'name': component.get('name', 'Unnamed'),
                            'tag': component.get('tag', 'untagged'),
                            'icon': component.get('icon', ''),
                            'path': subdir_name
                        }
                        if 'split_value_num' in component:
                              component_info['split_value_num'] = component['split_value_num'] 
                        if 'split_value_type' in component:
                              component_info['split_value_type'] = component['split_value_type']                               
                        # Add 'defaults' sub-object if it exists
                        if 'parameters' in component:
                            component_info['parameters'] = component['parameters'] 
                        components_list.append(component_info)
    return components_list


# add each gyre extensions to web path
# like "/gyre_extensions/(name of extension)/any file"
# these files are served from "gyre_entry" folder
components = collect_gyre_components()
unique_paths = set()
for component in components:
    unique_paths.add(component["path"])
current_dir = os.path.dirname(__file__)
# Get the parent directory (../ of current folder)
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))


for path in unique_paths:
    gyre_entry_folder_path = os.path.join(parent_dir, path, 'gyre_entry')
    if os.path.exists(my_path):
        workspace_app = web.Application()
        workspace_app.add_routes([web.static("/", gyre_entry_folder_path),])
    server.PromptServer.instance.app.add_subapp("/gyre_extensions/" + path + "/", workspace_app)    




gyre_app = web.Application()
my_path = os.path.join(workspace_path, 'gyre')
if os.path.exists(my_path):
    gyre_app.add_routes([
        web.static("/", my_path),
        #web.get('/', handler)
    ])
server.PromptServer.instance.app.add_subapp("/gyreapp/", gyre_app)





@server.PromptServer.instance.routes.post("/gyre/collect_gyre_components")
async def collect_gyre_components_ws(request):
    components_list=collect_gyre_components()
    return web.Response(text=json.dumps(components_list), content_type='application/json')

@server.PromptServer.instance.routes.get("/gyre/init_components.js")
async def create_js_file(request):
    # Call the collect_gyre_components function to get the list of components
    components = collect_gyre_components()

    # Set containing unique relative paths to 'gyre_init.js'
    unique_paths = set()

    abspath = request.scheme+'://'+request.host
    # Loop over each component to add unique script paths
    for component in components:        
        # Add to the set of unique paths
        unique_paths.add(component["path"])

    # Initialize a string for the JavaScript code
    js_code = f"""globalThis.gyre.serverName = "{abspath}";"""

    # Loop over the unique paths and build the script tags
    for path in unique_paths:
        # Build the JavaScript code to create the script element
        js_code += f"""
        globalThis.gyre.setCurrentExtensionName("{path}")
        globalThis.gyre.loadScript("gyre_init.js")
        """
    
    return  web.Response(text=js_code, content_type='text/javascript')



def download_and_extract_github_repo():
    print("check update required")
    updaterequired =  check_update_required()
    if(updaterequired==False):
        print("update Gyre not required")
        return
    print(f'Download new version of Gyre application it can take some time please wait...')
    #url = f'https://github.com/grzegorzewskiflyingdog/aistudio/archive/refs/heads/main.zip'
    url = f'https://github.com/grzegorzewskiflyingdog/aistudio/archive/main.zip'
    response = requests.get(url)
    if response.status_code == 200:
        with zipfile.ZipFile(io.BytesIO(response.content)) as zip_ref:
            zip_ref.extractall(gyre_path)
        print(f'New version downloaded from {url}. Install it now to {gyre_path}. Please wait...')
        source_directory = os.path.join(gyre_path,"aistudio-main","dist")
        target_directory = os.path.join(source_directory, '..', '..', os.path.basename(source_directory))
        if os.path.exists(target_directory) and os.path.isdir(target_directory):
            shutil.rmtree(target_directory)
        shutil.move(source_directory, target_directory)
        print('Update finished')
    else:
        print(f'Failed to download repository: {response.status_code}')



def read_version_from_file(filename):
    try:
        # Read the pickled file
        with open(filename, 'rb') as file:
            version = pickle.load(file)
            return version
    except FileNotFoundError:
        # If the file does not exist, return an empty string
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""






def check_update_required():
        filename = os.path.join(comfy_path,'version.pkl')
        # Send a GET request to the URL to get the content of package.json
        oldversion = read_version_from_file(filename)
        response = requests.get(f'https://raw.githubusercontent.com/grzegorzewskiflyingdog/aistudio/main/package.json')
        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the JSON content
            package_info = response.json()
            # Extract the version property
            version = package_info.get('version')
            with open(filename, 'wb') as file:
                            pickle.dump(version, file)
                            #print(f"Version {version} saved to {filename}")
            if version:
                if(oldversion!=version):
                    print(f"other gyre version: {version} installed version: {oldversion} update required")
                    return True
                else:
                    print(f"same gyre version {version}")
                    return False
            else:
                print("Version property not found in package.json")
        else:
            print(f"Failed to fetch package.json. Status code: {response.status_code}")


def write_json_to_file(json_str):
        my_workflows_dir = get_my_workflows_dir()
        full_path = os.path.join(my_workflows_dir, file_path)
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as file:
            file.write(json_str)



def get_all_model_files():
    # Navigate up to the 'models' folder
    current_path = os.path.abspath('./models')
    while True:
        parent_path, current_folder = os.path.split(current_path)
        if current_folder == 'models':
            models_path = current_path
            break
        elif parent_path == current_path:  # Root path reached
            raise Exception("No 'models' folder found in the directory hierarchy.")
        current_path = parent_path

    files_with_dot = []
    # Recursively scan for files with a dot in their name
    for root, dirs, files in os.walk(models_path):
        # Skip directories containing a README.md file
        if 'README.md' in files:
            dirs[:] = []  # Clear dirs to prevent os.walk from traversing further down this path
            continue        
        for file in files:
            # Ignore YAML, JSON and more files files
            if file.endswith(('.yaml', '.yml','.json','.py','.js','.me')):
                continue
            # only files with a . in name
            if '.' in file:
                file_path = os.path.relpath(os.path.join(root, file), models_path).replace('\\', '/')
                files_with_dot.append(file_path)
    result = {"models": files_with_dot}
    return result

@server.PromptServer.instance.routes.post("/gyre/get_all_models")
async def get_all_models(request):
    models_list=get_all_model_files()
    return web.Response(text=json.dumps(models_list), content_type='application/json')

# Shared dictionary to store progress
progress = {}
async def download_model(session, model):
    models_path = os.path.abspath('./models')
    target_path = os.path.join(models_path,model["target_folder"], model["target_name"])
    
    os.makedirs(model["target_folder"], exist_ok=True)

    async with session.get(model["source_url"]) as response:
        response.raise_for_status()
        total_size = int(response.headers.get('content-length', 0))
        downloaded_size = 0

        with open(target_path, "wb") as f:
            while True:
                chunk = await response.content.read(1024)
                if not chunk:
                    break
                f.write(chunk)
                downloaded_size += len(chunk)
                progress[model["path"]] = downloaded_size / total_size * 100

@server.PromptServer.instance.routes.get("/gyre/download_models")
async def prepare_models_download(request):
    path = get_my_workflows_dir()
    pathdefault = get_my_default_workflows_dir()
    deactivateddir = get_my_deactivatedworkflows_dir()
    fileList = folder_handle(path, [])
    fileListdefault = folder_handle(pathdefault, [])
    deactivated = folder_handle(deactivateddir, [])
    workflowList = [fileList + fileListdefault + deactivated][0]
    id = request.query.get('id')
    workflowInfo = None
    modelList = None
    models = []
    for wf in workflowList:
        if (wf['id']==id):
            workflowInfo=wf
    res={'message':"Not found"}
    if workflowInfo:
        res= {'id': id}
        workflow = json.loads(workflowInfo['json'])    
        if 'extra' in workflow and 'gyre' in workflow['extra'] and 'models' in workflow['extra']['gyre']:
            modelList = workflow['extra']['gyre']['models']    
    if not modelList:
        res={'message':"No models found"}
    else:
        availableModels=get_all_model_files()["models"]
        for modelInfo in modelList:
            if modelInfo['path'] not in availableModels:
                directory, filename = os.path.split(modelInfo['path'])
                models.append({
                    "path": modelInfo['path'],
                    "target_folder": directory,
                    "target_name": filename,
                    "source_url": modelInfo['URL']
                })                
        async with aiohttp.ClientSession() as session:
            tasks = [download_model(session, model) for model in models]
            await asyncio.gather(*tasks)
            global progress
            progress = {}

    return web.Response(text=json.dumps(res), content_type='application/json')

@server.PromptServer.instance.routes.get("/gyre/download_progress")
async def download_progress(request):
    return web.Response(text=json.dumps(progress), content_type='application/json')

@server.PromptServer.instance.routes.get("/gyre/clear_download_progress")
async def clear_download_progress(request):
    global progress
    progress = {}
    return web.Response(text=json.dumps({"status":"Progress cleared"}), content_type='application/json')

download_and_extract_github_repo()
