import matplotlib.pyplot as plt
import numpy as np
import sys, os
import importlib.util
from PIL import Image

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", "algorithm"))
from utils import *

def make_py_chart(floor):
    colors = ["#4fa1ff", "#4f55ff", "#1f26f0", "#7361e8"]
    percents = get_percents()
    percents = percents[floor]

    # make pie chart
    fig, ax = plt.subplots()
    ax.pie([p[1] for p in percents], colors=colors, autopct='%1.1f%%', startangle=90)
    ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    legend = {(colors[0], -1)}
    for i, p in enumerate(percents):
        legend.add((colors[i], p[0]))
    legend = list(legend)
    legend.remove((colors[0], -1))
    
    # save image
    plt.savefig(os.path.join(os.path.dirname(__file__), "..", "..", "interface", "images",  f"piechart.png"))
    # load image
    img = Image.open(os.path.join(os.path.dirname(__file__), "..", "..", "interface", "images",  f"piechart.png"))
    # remove the white background
    img = img.convert("RGBA")
    datas = img.getdata()
    newData = []
    for item in datas:
        if item[0] == 255 and item[1] == 255 and item[2] == 255:
    
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    # crop the image to a square
    width, height = img.size
    if width > height:
        left = (width - height) / 2
        top = 0
        right = (width + height) / 2
        bottom = height
    else:
        left = 0
        top = (height - width) / 2
        right = width
        bottom = (height + width) / 2
    img = img.crop((left, top, right, bottom))
    img.save(os.path.join(os.path.dirname(__file__), "..", "..", "interface", "images",  f"piechart.png"), "PNG")  

    return legend  