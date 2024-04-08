import os
from datetime import datetime

import torch.utils.data
from torch import optim

from minimagen.Imagen import Imagen
from minimagen.Unet import Unet, Base, Super, BaseTest, SuperTest
from minimagen.generate import load_minimagen, load_params
from minimagen.t5 import get_encoded_dim
from minimagen.training import get_minimagen_parser, ConceptualCaptions, get_minimagen_dl_opts, \
    create_directory, get_model_size, save_training_info, get_default_args, MinimagenTrain, \
    load_testing_parameters

# Get device
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# Command line argument parser
parser = get_minimagen_parser()
args = parser.parse_args()


