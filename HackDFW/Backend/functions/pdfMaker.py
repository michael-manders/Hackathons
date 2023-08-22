from fpdf import FPDF


def makePdf(sus):
    pdf = FPDF()
    pdf.add_page()
    
    lines = 1

    for category in sus:
        pdf.set_font("Arial", size = 17)
        pdf.cell(200, 10, txt = category.upper(),
         ln = lines, align = 'C')
        
        lines += 1

        pdf.set_font_size(15)

        for type in sus[category]:
            for adv in sus[category][type]:
                pdf.multi_cell(200, 10, txt = f'  -  {adv}',  border = 0, align= 'L', fill= False)
                lines += 1

    pdf.image("./assets/images/logo2.png", x=30, y=230, w=150, h=44)



    pdf.output("./return.pdf")    
