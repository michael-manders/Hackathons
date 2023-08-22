import json
import extractText
import os


def extractInformation(text):
    lines = [line.replace("\n", "").replace("Scope 1", "").replace("Scope 2", "").replace("Scope 3", "").replace("Offsets", "") for line in text.split("-") if len(line) > 10]
    keywords = json.load(open(f'{os.path.abspath(os.getcwd())}../../Backend/data/keywords.json', "r")) 
    category = list(keywords)[0]

    output = []

    for line in lines:
        line = line.lower()
        previousType = category
        for type in keywords:
            matches = 0
            for word in keywords[type]["keywords"]:
                if word in line: matches += 1

            prevMatches = 0
            for word in keywords[previousType]["keywords"]:
                if word in line: prevMatches += 1

            if matches > prevMatches:
                category = type

            previousType = type 
        
        variablePrefixes = keywords[category]["variablePrefixes"]
        line = line.split()
        vars = []
        
        for prefix in variablePrefixes:
            try:
                index = line.index(prefix) + 1
                vars.append(line[index].replace(",", ""))
            except:
                pass
        
        if "kilometers" in line and category != "transportation":
            vars[0] = round(int(vars[0]) * 0.621371)
        
        for i in range(len(vars)):
            var = vars[i]
            try:
                vars[i] = int(var)
            except:
                pass

        output.append({
            "category": category,
            "variables": vars,
            "sentence": " ".join(line)
        })

    return output
