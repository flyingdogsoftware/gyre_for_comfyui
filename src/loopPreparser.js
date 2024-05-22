export class loopPreparser {

  constructor(workflow) {
    this.workflow = workflow
    this.nodeMapping = {}
  }

  getGroup(node, groups) {
    return groups.find(group => {
      const [gx, gy, gWidth, gHeight] = group.bounding;
      const [nx, ny] = node.pos;
      return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
    });
  }
  getNodeById(nodeId) {
    return this.workflow.nodes.find(node => node.id === nodeId)
  }
  getGroupByName(groupName) {
    return this.workflow.groups.find(group => group.title === groupName)
  }
  isNodeInGroup(nodeId, groupName) {
    const node = this.workflow.nodes.find(n => n.id === nodeId);
    if (!node) return false; // Node not found

    const group = this.workflow.groups.find(group => group.title === groupName && group.bounding);
    if (!group) return false; // Group not found

    const [gx, gy, gWidth, gHeight] = group.bounding;
    const [nx, ny] = node.pos;
    return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
  }
  /**
   * link data structures are redudant in ComfyUI so re-generate link infos from global linkk structure
   */
  updateNodeLinks() {
    // Step 1: Clear existing link IDs from inputs and outputs
    this.workflow.nodes.forEach(node => {
      if (node.inputs) {
        node.inputs.forEach(input => {
          input.link = null;
        });
      }
      if (node.outputs) {
        node.outputs.forEach(output => {
          output.links = [];
        });
      }
    });

    // Step 2: Iterate over links to update inputs and outputs
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link
      const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID)
      const toNode = this.workflow.nodes.find(node => node.id === toNodeID)

      if (fromNode && fromNode.outputs && fromNode.outputs[fromSlot]) {
        if (!fromNode.outputs[fromSlot].links) {
          fromNode.outputs[fromSlot].links = []
        }
        fromNode.outputs[fromSlot].links.push(linkID)
      }

      if (toNode && toNode.inputs && toNode.inputs[toSlot]) {
        toNode.inputs[toSlot].link = linkID
      }
    })
  }

 removeGyreNodesAndLinkDirectly() {
    // Iterate backwards to avoid indexing issues after removal
    for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
      const node = this.workflow.nodes[i];
      if (node.type === "GyreLoopStart" || node.type === "GyreLoopEnd") {
        const outgoingLink = this.workflow.links.find(link => link[1] === node.id);
        const incomingLink = this.workflow.links.find(link => link[3] === node.id);
        
        if (outgoingLink && incomingLink) {
          // Create a new link replacing the GyreNode
          const newLink = [this.workflow.last_link_id + 1, incomingLink[1], incomingLink[2], outgoingLink[3], outgoingLink[4], outgoingLink[5]];
          this.workflow.last_link_id++; // Update last link ID
          this.workflow.links.push(newLink);
          // Remove the original links
          this.workflow.links = this.workflow.links.filter(link => link[0] !== outgoingLink[0] && link[0] !== incomingLink[0]);
  
          // Remove the GyreLoop node
          this.workflow.nodes.splice(i, 1);
        }
      }
    }
  }
  

  /*
  for the conections between the groups add a GyreLoopStart node in-between so it is easier to make another group 
   */
  splitLinkWithGyreStartNode(linkID) {
    const linkIndex = this.workflow.links.findIndex(link => link[0] === linkID)
    if (linkIndex === -1) return // Link not found
    const originalLink = this.workflow.links[linkIndex];
    const [_, fromNodeID, fromSlot, toNodeID, toSlot, type] = originalLink
  
    // Assuming workflow.last_node_id and workflow.last_link_id are correctly set
    const newGyreStartNodeID = ++this.workflow.last_node_id
    const newLink1ID = ++this.workflow.last_link_id
    const newLink2ID = ++this.workflow.last_link_id
  
    // Create GyreStartNode
    const gyreStartNode = {
      id: newGyreStartNodeID,
      type: 'GyreLoopStart',
      pos: [0, 0],    // willbe removed anyway
      inputs:[
        {
            "name": "ANY",
            "type": "*",
            "link": 16
        }
    ]}
    this.workflow.nodes.push(gyreStartNode);
    // Create the first new link from the original source to the GyreStartNode
    const newLink1 = [newLink1ID, fromNodeID, fromSlot, newGyreStartNodeID, 0 /* Assuming slot 0 for GyreStartNode */, type]
    // Create the second new link from the GyreStartNode to the original destination
    const newLink2 = [newLink2ID, newGyreStartNodeID, 0 /* Assuming slot 0 for output */, toNodeID, toSlot, type]  
    // Add the new links to the workflow
    this.workflow.links.push(newLink1, newLink2)
    // Remove the original link
    this.workflow.links.splice(linkIndex, 1)
  }
  /* Gyre loops: reroute end loop link and make new link between groups
  */
  adjustLinksForSpecialNodes(groupName) {
    // 1. reroute to end loop
    // Assuming `this.nodeMapping` maps original node IDs to their new duplicated IDs
    const gyreLoopEndNodes = this.workflow.nodes.filter(node => node.type === "GyreLoopEnd").map(node => node.id);

    const linksToRemove = []; // Ids only
    let removedLinks = [];  // store link objects for new links between groups
    const newLinks = [];
  
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;

      if (gyreLoopEndNodes.includes(toNodeID) && this.isNodeInGroup(fromNodeID, groupName)) {
        // Mark this link for removal
        linksToRemove.push(linkID);
        removedLinks.push([...link]); 
        // Create a new link from the cloned node to the "GyreLoopEnd" node
        const newLink = [this.workflow.last_link_id + 1, this.nodeMapping[fromNodeID], fromSlot, toNodeID, toSlot, type];
        newLinks.push(newLink);
        this.workflow.last_link_id++;
      }
    });

    // Remove identified links
    this.workflow.links = this.workflow.links.filter(link => !linksToRemove.includes(link[0]));

    // Add new links
    this.workflow.links.push(...newLinks)


    // For each link removed earlier...
    // Assuming removedLinks and nodeMapping are already defined
    // generate connections between groups
    removedLinks.forEach(removedLink => {
      const [removedLinkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = removedLink;
      // Find a link where the toNode is the destination of a link from a "GyreLoopStart"
      let linkFromGyreLoopStart 
      this.workflow.links.forEach(link => {
        const [_, linkFromNodeID, __, linkToNodeID, slot, linkType] = link;
        if (this.getNodeById(linkFromNodeID).type==="GyreLoopStart" && this.isNodeInGroup(linkToNodeID,groupName)) {
          if (fromSlot===slot) linkFromGyreLoopStart=link
        }
      })
      if (linkFromGyreLoopStart) {
        // Assuming you can find the cloned node ID for the node that was linked to by the GyreLoopStart
        const clonedToNodeID = this.nodeMapping[linkFromGyreLoopStart[3]]; // Use the toNodeID of the linkFromGyreLoopStart for mapping
        if (clonedToNodeID) {
          const newLinkID = ++this.workflow.last_link_id;
          const newLink = [newLinkID, fromNodeID, fromSlot, clonedToNodeID, fromSlot, type] // same slot here, this is current limitation
    //      console.log("new between groups link",newLink)
          this.workflow.links.push(newLink)
          this.splitLinkWithGyreStartNode(newLinkID)
        }
      }
    })
  }

  duplicateGroupWithNodesAndLinks(groupName,groupNameClone) {
    // Assuming getGroupByName and isNodeInGroup functions are defined elsewhere
    const originalGroup = this.getGroupByName(groupName);
    if (!originalGroup) return; // Exit if group not found

    let maxNodeId = this.workflow.last_node_id;
    let maxLinkId = this.workflow.last_link_id;

    // Duplicate group
    const newGroup = JSON.parse(JSON.stringify(originalGroup))
    newGroup.title = groupNameClone 
    newGroup.bounding[0] += originalGroup.bounding[2]+70 // Shift the new group to prevent overlap
    this.workflow.groups.push(newGroup);

    this.nodeMapping = {} // Map old node IDs to new node IDs

    // Duplicate nodes
    this.workflow.nodes.forEach(node => {
      if (this.isNodeInGroup(node.id, groupName)) {
        const newNode = JSON.parse(JSON.stringify(node));
        newNode.id = ++maxNodeId;
        newNode.pos[0] += originalGroup.bounding[2]+70 // Shift the new group to prevent overlap
        this.nodeMapping[node.id] = newNode.id; // Map old ID to new ID
        this.workflow.nodes.push(newNode);
       // console.log("add node", newNode)
      }
    });

    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link; // Destructure the original link array
      // Check if both source and target nodes are within the group being duplicated
      if (this.nodeMapping[fromNodeID] && this.nodeMapping[toNodeID]) {
        // Create a new link for the duplicated nodes
        const newLink = [
          ++maxLinkId, // Assign a new unique ID for the link
          this.nodeMapping[fromNodeID], // Map old source node ID to new
          fromSlot, // Preserve the original fromSlot
          this.nodeMapping[toNodeID], // Map old target node ID to new
          toSlot, // Preserve the original toSlot
          type // Preserve the link type
        ];
        this.workflow.links.push(newLink); // Add this new link to the workflow
      }
    });

    // outside links going inside group nodes duplication
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link
      const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID)
      const toNode = this.workflow.nodes.find(node => node.id === toNodeID)

      // Check if the toNode is inside the group and fromNode is outside and not of specific types
      if (this.isNodeInGroup(toNodeID, groupName) && !this.isNodeInGroup(fromNodeID, groupName) &&
        fromNode.type !== 'GyreLoopStart' && fromNode.type !== 'GyreLoopEnd') {
        // Logic to duplicate the link here
        const newLinkID = ++maxLinkId; // Increment and assign new max link ID
        const newLink = [newLinkID, fromNodeID, fromSlot, this.nodeMapping[toNodeID], toSlot, type]
        this.workflow.links.push(newLink)
      }
    })
    this.workflow.last_link_id = maxLinkId
    this.workflow.last_node_id = maxNodeId
  
    this.adjustLinksForSpecialNodes(groupName)
    this.cloneMappings(groupName)

  }

  /**
   * clone mappings
   * @param string groupName 
   * @returns 
   */
  cloneMappings(groupName) {
    let mappings=this.workflow.extra.gyre.mappings
    if (!mappings) return
    for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
      const node = this.workflow.nodes[i]
      if (this.isNodeInGroup(node.id,groupName)) {
        let nodeMappings=mappings[node.id]
        if (nodeMappings) {
          let newNodeID=this.nodeMapping[node.id]
          if (newNodeID) {
            mappings[newNodeID]=JSON.parse(JSON.stringify(nodeMappings))
          }
          
        }
      }
    }

    this.workflow.extra.gyre.mappings=mappings
  }
  deactivateGroup(groupName) {
    for (let i = this.workflow.nodes.length - 1; i >= 0; i--) {
      const node = this.workflow.nodes[i]
      if (this.isNodeInGroup(node.id,groupName)) {
        node.mode=4 // deactivate it
      }
    }
    
  }
  generateLoop(arrayName,arraySize) {
    let group=this.getGroupByName(arrayName+"[]")
    if (!group) return
    group.title=arrayName+"[0]"

    if (arraySize===0) {  // deactivate group nodes
      this.deactivateGroup(arrayName+"[0]")
      this.removeGyreNodesAndLinkDirectly()    
      this.updateNodeLinks()
      return
    }
    if (arraySize>1) {  // only rename group and remove loop nodes
      for(let i=0;i<arraySize-1;i++) {  
        this.duplicateGroupWithNodesAndLinks(arrayName+"["+i+"]",arrayName+"["+(i+1)+"]")    
      }
    }
    this.removeGyreNodesAndLinkDirectly()    
    this.updateNodeLinks()
  }

}