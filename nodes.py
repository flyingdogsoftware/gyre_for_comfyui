from .inspyrenet_pipeline import InSPyReNetNode
import folder_paths


class AlwaysEqualProxy(str):
    def __eq__(self, _):
        return True

    def __ne__(self, _):
        return False

class IfElse:
    """
    this node does nothing but it is required for Gyre if else (e.g. Inpainting)
    """

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "true": (AlwaysEqualProxy("*"),),
                "false": (AlwaysEqualProxy("*"),),
                "route": ("BOOLEAN", {"default": False}),
            },
                                     
        }

    RETURN_TYPES = (AlwaysEqualProxy("*"),)

    RETURN_NAMES = ("ANY",)

    FUNCTION = "live_route"

    CATEGORY = "Gyre"

    def live_route(self, true,false,route ):
        return (true if route else false,)


class LoopStart:
    """
    this node does nothing but it is required for Gyre loops (e.g. ControlNet list)
    """

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "ANY": (AlwaysEqualProxy("*"),),
            },
        }

    RETURN_TYPES = (AlwaysEqualProxy("*"),)

    RETURN_NAMES = ("ANY",)

    FUNCTION = "do_nothing"

    CATEGORY = "Gyre"

    def do_nothing(self, ANY):
        return (ANY,)

class LoopEnd:
    """
    this node does nothing but it is required for Gyre loops (e.g. ControlNet list)
    """

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "ANY": (AlwaysEqualProxy("*"),),
            },
        }

    RETURN_TYPES = (AlwaysEqualProxy("*"),)

    RETURN_NAMES = ("ANY",)

    FUNCTION = "do_nothing"

    CATEGORY = "Gyre"

    def do_nothing(self, ANY):
        return (ANY,)

class BackgroundRemovalNode:
    """
    This node performs background removal using InSPyReNet.
    """

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "image": ("IMAGE",),
                "shrink_factor": ( "FLOAT", {
                    "default": 0.2,
                    "min": 0.0,
                    "max": 1.0,
                    "step": 0.1,
                    "round": 0.1, 
                    "display": "number"}),
            },
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("output",)
    FUNCTION = "process"
    CATEGORY = "Image Processing"

    def __init__(self):
        self.node = InSPyReNetNode()

    def process(self, image,shrink_factor):
        self.node.load_model()
        return (self.node.process(image,shrink_factor),)



# A dictionary that contains all nodes you want to export with their names
# NOTE: names should be globally unique
NODE_CLASS_MAPPINGS = {
    "BackgroundRemoval": BackgroundRemovalNode,
    "GyreLoopStart": LoopStart,
    "GyreLoopEnd": LoopEnd,
    "GyreIfElse": IfElse,

}

# A dictionary that contains the friendly/humanly readable titles for the nodes
NODE_DISPLAY_NAME_MAPPINGS = {
    "BackgroundRemoval": "Gyre Background Removal",
    "GyreLoopStart": "Loop Start",
    "GyreLoopEnd": "Loop End",
    "GyreIfElse": "If Else",

}    


