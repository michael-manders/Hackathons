import json
import os
from calcCarbon import transportation, electric
from extractInformationFromText import extractInformation
import extractText
from offsetCalculator import offsets as offsetCalculator

def suggestions(category, sentence, var1, var2=0):
    suggestionsJson = json.load(open(f'{os.path.abspath(os.getcwd())}../../Backend/data/suggestions.json', "r"))
    generals = suggestionsJson[category]["general"]

    replacements = suggestionsJson[category]["replacements"]
    replacementSuggestions = []

    for replacement in replacements:
        key, replace = replacement
        if key in sentence:
            if category == "transport":
                froma, toa, difference = transportation(key, replace, var1, var2)
                string = f'You could stop {difference} tons of carbon from being produced by switching transportation from {key} to {replace}'
                return [string]

            elif category == "electric":
                froma, toa, difference = electric(key, replace, var1 )
                striag = f'To completely eliminate {difference} tons of carbon emissions switch from {key} to {replace}'
                return [string]
        
    if len(replacements) == 0:
        if category == "production":
            produced = var1 * var2
            cost, method = offsetCalculator(produced)
            string = f'To offset the carbon emitted during production you can invest ${cost} into {method}'
            generals = suggestionsJson["production"]["general"]
            return [string, generals]
            
        elif category == "land":
            cost, method = offsetCalculator(var1 * 1.25426)
            string = f'To offset the carbon emitted from land use you can invest ${cost} into {method}'
            generals = suggestionsJson["land"]["general"]
            return [string, generals]
        
        elif category == "consumer":
            tons = var1 * var2
            post, method = offsetCalculator(tons)
            string = f'To offset the carbon emmited by your products after sale you can invest ${post} into {method}'
            general = suggestionsJson["consumer"]["general"]
            return [string, generals]


def suggestionsGen(outputs):

    sus = {
        "transport": {
            "general": [],
            "targeted": []
        },
        "electric": {
            "general": [],
            "targeted": []
        },
        "production": {
            "general": [],
            "targeted": []
        },
        "land": {
            "general": [],
            "targeted": []
        },
        "consumer": {
            "general": [],
            "targeted": []
        }
    }

    for output in outputs:
        category = output["category"]
        if len(output["variables"]) > 0:
            var1 = output["variables"][0]
            try:
                var2 = output["variables"][1]
                sentence = output["sentence"]
                out = suggestions(category, sentence, var1, var2)
            
            except :
                sentence = output["sentence"]
                out = suggestions(category, sentence, var1)

        try:
            if len(out) > 1:
                sus[category]["targeted"].append(out[0])
                sus[category]["general"] = out[1]
            else:
                sus[category]["targeted"].append(out[0])
        except:
            pass
    return sus




