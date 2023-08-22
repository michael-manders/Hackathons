import PyPDF2 
import os

def extractText(filename):
    path = f"{os.path.abspath(os.getcwd())}/uploads/{filename}"

    pdf = open(path, "rb")
    pdfRead = PyPDF2.PdfFileReader(pdf)
    pageObj = pdfRead.getPage(0)
    # f = open(f"{filename}.txt",'w')
    # f.write(pageObj.extract_text())
    # f.close()
    return pageObj.extract_text()