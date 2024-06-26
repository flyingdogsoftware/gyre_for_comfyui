# High-Quality Background removal
# Code based on (old) Gyre server, Thanks to https://github.com/hafriedlander  👍
# two stages: 1. using InsPyReNet 2. Guided Filter for Hi-Res support

import math
import torch
import kornia
from typing import Literal
import numpy as np
from .models.guided_filter import guidedfilter2d_color
from .gyre_helper import images
from safetensors.torch import load_file
import os
import folder_paths # type: ignore

# Define the necessary constants
MEAN = torch.tensor([0.485, 0.456, 0.406])
STD = torch.tensor([0.229, 0.224, 0.225])
MAX_RES = 1280

class InSPyReNetPipeline:
    def __init__(self, module):
        self.module = module

    def to(self, device):
        self.module.to(device)

    def pipeline_modules(self):
        return [("module", self.module)]

    @torch.no_grad()
    def __call__(
        self, tensor, mode: Literal["alpha", "mask"] = "alpha", shrink_factor=0.2):
        color=[0, 0, 0]
        """
        Color must be 0..1 if used, not 0..255
        """
        if tensor.ndim != 4 or tensor.shape[2] < 3:
            raise ValueError("Tensor must be RGB image in BCHW format")

        tensor = tensor[:, [0, 1, 2]]  # Discard any existing alpha
        scale = None
        padding = None
        guided_filter = None

        if tensor.shape[-1] > MAX_RES or tensor.shape[-2] > MAX_RES:

            # Pad up to square
            maxdim = max(tensor.shape[-2], tensor.shape[-1])

            padding = (maxdim - tensor.shape[-1], 0, maxdim - tensor.shape[-2], 0)
            sample = torch.nn.functional.pad(tensor, padding, mode="reflect")

            # Scale down to 1280 x 1280
            scale = min(MAX_RES / tensor.shape[-2], MAX_RES / tensor.shape[-1])

            sample = images.resize(sample, scale).contiguous()

            # Use guided filter if tensor is over double MAX_RES
            guided_filter = scale < 0.5

        else:
            # Calculate the padding sizes
            max_height = math.ceil(tensor.shape[-2] / 32) * 32
            max_width = math.ceil(tensor.shape[-1] / 32) * 32
            # Calculate the padding values for both dimensions
            pad_height = max_height - tensor.shape[-2]
            pad_width = max_width - tensor.shape[-1]

            # Ensure the padding is evenly distributed on both sides            
            padding = (pad_width // 2, pad_width - pad_width // 2, pad_height // 2, pad_height - pad_height // 2)

            #padding = (maxdim - tensor.shape[-1], 0, maxdim - tensor.shape[-2], 0)  

            sample = torch.nn.functional.pad(tensor, padding, mode="reflect")

       # device = modeling_utils.get_parameter_device(self.module)
       # dtype = modeling_utils.get_parameter_dtype(self.module)
        device = next(self.module.parameters()).device
        dtype = next(self.module.parameters()).dtype

        sample = kornia.enhance.normalize(sample, MEAN, STD)
        sample = sample.to(device, dtype)
        pred = self.module(sample)
        pred = pred.to(tensor.device, tensor.dtype)

        if scale is not None:
            pred = images.resize(pred, 1 / scale)

        print(pred.shape)
        print(tensor.shape)
        if padding is not None:
            print("padding is not None")
            #pred = pred[:, :, padding[2] :, padding[0] :]
            pred = pred[:, :, padding[2]:padding[2] + tensor.shape[2], padding[0]:padding[0] + tensor.shape[3]]

        print(pred.shape)

        if guided_filter:
            guided_pred = (
                guidedfilter2d_color(
                    tensor.to(torch.float64), pred.to(torch.float64), 32, 1e-8
                )
                .clamp(0, 1)
                .to(tensor.dtype)
            )

            pred = torch.max(guided_pred, pred)

        # Slightly shrink mask
        pred = ((pred - shrink_factor) / (1 - shrink_factor)).clamp(0, 1)

        if mode == "mask":
            return pred

        elif mode == "alpha":
            return torch.cat([tensor, pred], dim=1)
        else:
            raise ValueError(f"Unknown background removal mode {mode}")


def process_image(image_tensor: torch.Tensor, shrink_factor, model, device):
    image_tensor = image_tensor.permute(0, 3, 1, 2)
    # Initialize the pipeline
    pipeline = InSPyReNetPipeline(model)
    # Move module to the appropriate device
    pipeline.to(device)
    # Apply the pipeline directly
    result_tensor = pipeline(image_tensor.to(device), "alpha",shrink_factor)
    result_tensor = result_tensor.permute(0, 2, 3, 1)
    return result_tensor

class InSPyReNetNode:
    def __init__(self):
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def load_model(self):
        from .inspyrenet.InSPyReNet import InSPyReNet_SwinB
        self.model = InSPyReNet_SwinB(depth=64, pretrained=False, base_size=[1024, 1024], threshold=None)
        
        model_path = os.path.join(os.path.dirname(folder_paths.__file__),"models/inspyrenet/InSPyReNet_Plus_Ultra.safetensors")

        model_weights = load_file(model_path, device="cpu")
        self.model.load_state_dict(model_weights)
        self.model.eval()
        self.model.to(self.device)

    def process(self, image, shrink_factor):
        if self.model is None:
            raise RuntimeError("Model is not loaded. Please load the model first.")
        return process_image(image,shrink_factor, self.model, self.device)
