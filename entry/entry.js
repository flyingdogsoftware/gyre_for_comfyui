const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// @ts-ignore
const callback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      // @ts-ignore
      mutation.addedNodes.forEach((node) => {

        if (node.nodeName === "SCRIPT" || node.nodeName === "CANVAS") {
          // @ts-ignore
          import("/dist/build/bundle.js");
          observer.disconnect();
          if (window.gyreClearAllComboValues) window.gyreClearAllComboValues()

          const drawNodeWidgets = LGraphCanvas.prototype.drawNodeWidgets
          LGraphCanvas.prototype.drawNodeWidgets = function (
            node,
            posY,
            ctx,
            active_widget
          ) {
            if (!node.widgets || !node.widgets.length) {
              return 0;
            }
            // call original drawing function 
            drawNodeWidgets.apply(this, arguments)

            var width = node.size[0];
            var widgets = node.widgets;
            posY += 2;
            var H = LiteGraph.NODE_WIDGET_HEIGHT;
            var show_text = this.ds.scale > 0.5;
            if (!show_text) return
            ctx.save();
            ctx.globalAlpha = this.editor_alpha;
            var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
            var background_color = LiteGraph.WIDGET_BGCOLOR;
            var text_color = "rgb(227, 206, 116)" //LiteGraph.WIDGET_TEXT_COLOR;
            var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
            var margin = 15;
            // now only change some labels (color+mapping)
            for (var i = 0; i < widgets.length; ++i) {

              var w = widgets[i];
              var y = posY;
              if (w.y) {
                y = w.y;
              }
              w.last_y = y;
              ctx.strokeStyle = outline_color;
              ctx.fillStyle = "#222";
              ctx.textAlign = "left";
              if (w.disabled) ctx.globalAlpha *= 0.5;
              let widget_width = w.width || width

              if (!window.checkGyreMapping) continue
              let label=window.checkGyreMapping(node,w,i)
              if (label) {
              switch (w.type) {
                case "button":
                    ctx.textAlign = "center"
                    ctx.fillStyle = text_color
                    ctx.fillText(label, widget_width * 0.5, y + H * 0.7)
                  break;
                case "toggle":
                    ctx.fillStyle = text_color
                    ctx.fillText(label, margin * 2, y + H * 0.7)
                  break
                case "slider":
                  ctx.textAlign = "center";
                    ctx.fillStyle = text_color;
                    ctx.fillText(
                      label +
                          "  " +
                          Number(w.value).toFixed(
                            w.options.precision != null ? w.options.precision : 3
                          ),
                      widget_width * 0.5,
                      y + H * 0.7
                    )
                  break
                case "number":
                case "combo":
                  ctx.textAlign = "left"
                  ctx.fillStyle = text_color
                  ctx.fillText(label, margin * 2 + 5, y + H * 0.7)
                  break;
                case "string":
                case "text":
                  ctx.textAlign = "left"
                  ctx.fillStyle = text_color
                  ctx.fillText(label, margin * 2, y + H * 0.7);

                  break;
                case "customtext":  // multiline input (e.g. prompt), draw information below because textarea is on top
                    ctx.textAlign = "left"
                    ctx.fillStyle = text_color
                    y+=w.element.offsetHeight+1
                    ctx.fillText(label, 2, y + H * 0.7);
                    break;
              }
            }
              posY += (w.computeSize ? w.computeSize(widget_width)[1] : H) + 4;
              ctx.globalAlpha = this.editor_alpha;
            }
            ctx.restore();
            ctx.textAlign = "left";
          };
          const getNodeMenuOptions = LGraphCanvas.prototype.getNodeMenuOptions;
          LGraphCanvas.prototype.getNodeMenuOptions = function (node) {
            const response = getNodeMenuOptions.apply(this, arguments);

            response.push({
              "content": "Gyre Mappings...",
              "callback": (item, options, e, menu, node)=>{
              //  console.log("node:",node.id,node.widgets )
                window.openGyreMappings(node,e)
              }
            })

            return response;
          }
        }
      });
    }
  }
};

console.log("HELLO")


// Create an instance of the MutationObserver
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);


class Gyre {
  serverName
  currentExtensionName
  serverProtocol
  serverFromBrowser
  setCurrentExtensionName(extensionName) {
    this.currentExtensionName=extensionName
  }
  getFullExtensionPath(extensionName) {
    // fix protocol - get it from browser
    //this.serverName = this.serverName.replace(/(^\w+:|^)\/\//, '');
    //this.serverName = this.serverProtocol+'//'+this.serverName;
    this.serverName = this.serverFromBrowser;
    return this.serverName+"/gyre_extensions/"+extensionName
  }

  loadScript(path,extensionName="") {
    if (!extensionName) extensionName=this.currentExtensionName
    let src=this.getFullExtensionPath(extensionName)+"/"+path
    let script=window.document.createElement("script")
    script.async = false
    script.src=src
    document.head.appendChild(script)
  }
  loadExtScript(extensionName) {
    let src= this.serverFromBrowser+'/gyre_extensions/'+extensionName;
    let script=window.document.createElement("script")
    script.async = false
    script.src=src
    document.head.appendChild(script)
  }

  init() {
    return
  }
}
globalThis.gyre=new Gyre()
globalThis.gyre.init()


console.log("init components ok")