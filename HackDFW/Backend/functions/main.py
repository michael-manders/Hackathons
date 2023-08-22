from calcCarbon import transportation, electric
from extractInformationFromText import extractInformation
import extractText
from offsetCalculator import offsets as offsetCalculator
from suggestions import suggestionsGen
from pdfMaker import makePdf
import time


def main(filename):
    outputs = extractInformation(extractText.extractText(filename))
    suggestions = suggestionsGen(outputs)
    makePdf(suggestions)

print("File running")
main("uploaded.pdf")
