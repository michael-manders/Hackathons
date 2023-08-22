import json
import os
def transportation(replace, to, distance, weight):
    amounts = json.load(open(f'{os.path.abspath(os.getcwd())}../../Backend/data/amounts.json', "r"))
    tonKm = distance * weight
    froma = round(tonKm * amounts["transportation"][replace])
    toa = round(tonKm * amounts["transportation"][to])
    difference = froma - toa
    
    return (froma, toa, difference)

def electric(replace, to, amount):
    amounts = json.load(open(f'{os.path.abspath(os.getcwd())}../../Backend/data/amounts.json', 'r'))
    froma = (amounts["electric"][replace] * amount)
    toa = (amounts["electric"][to] * amount)
    difference = froma - toa
    return (froma, toa, difference)

