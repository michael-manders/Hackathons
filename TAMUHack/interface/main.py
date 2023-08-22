import pygame
import pygame as pg
from pygame.locals import *
from sys import exit
import os, sys
import pygame_textinput
import functions.pie_chart_maker as pcm
import matplotlib.pyplot as plt
import time

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from algorithm.utils import *

def hex_to_rgb(hex):
    hex = hex.lstrip('#')
    hlen = len(hex)
    return tuple(int(hex[i:i+hlen//3], 16) for i in range(0, hlen, hlen//3))


# initialize windowless game 1920 x 1080
pygame.init()
screen = pygame.display.set_mode((1920, 1080))
pygame.display.set_caption('Squirrelspace')
logo = pygame.image.load('./interface/images/logo.jpg')
pygame.display.set_icon(logo)

# ------------- TEXT INPUT -------------
class TextInput(pygame.sprite.Sprite):
    def __init__(self, x, y, width=100, height=50, color=(0, 0, 0),
                bgcolor=(0,47,119), selectedColor=(0,60,135), init_text=""):
        super().__init__()
        self.text_value = init_text
        self.isSelected = False
        self.color = color
        self.bgcolor = bgcolor
        self.selectedColor = selectedColor

        self.font = pygame.font.Font("./interface/fonts/font1.ttf", 32)
        self.text = self.font.render(self.text_value, True, self.color)
        self.bg = pygame.Rect(x, y, width, height)

    def clicked(self, mousePos):
        if self.bg.collidepoint(mousePos):
            self.isSelected = not(self.isSelected)
            return True
        return False 

    def update(self, mousePos):
        pass

    def update_text(self, new_text):
        temp = self.font.render(new_text, True, self.color)
        if temp.get_rect().width >= (self.bg.width - 20):
            return
        self.text_value = new_text
        self.text = temp

    def render(self, display, rect):
        self.pos = self.text.get_rect(center = (self.bg.x + self.bg.width/2,
                                                self.bg.y + self.bg.height/2))
        if rect:
            if self.isSelected:
                pygame.draw.rect(display, self.selectedColor, self.bg)
            else:
                pygame.draw.rect(display, self.bgcolor, self.bg)
            
        display.blit(self.text, self.pos)

class CustomGroup(pygame.sprite.Group):
    def __init__(self):
        super().__init__()
        self.current = None

    def current(self):
        return self.current

# ------------ FONTS ------------
title_font = pygame.font.Font('./interface/fonts/font1.ttf', 160)
begin_font = pygame.font.Font('./interface/fonts/font1.ttf', 60)
small = pygame.font.Font('./interface/fonts/font1.ttf', 30)
smaller = pygame.font.Font('./interface/fonts/font3.ttf', 25)
medium = pygame.font.Font('./interface/fonts/font2.otf', 90)
medium2 = pygame.font.Font('./interface/fonts/font2.otf', 30)
small2 = pygame.font.Font('./interface/fonts/font3.ttf', 32)
large = pygame.font.Font('./interface/fonts/font2.otf', 115)
smaller2 = pygame.font.Font('./interface/fonts/font3.ttf', 28)
small3 = pygame.font.Font('./interface/fonts/font1.ttf', 27)
small4 = pygame.font.Font('./interface/fonts/font1.ttf', 40)

# -------------- GLOBALS --------------
page_state = 'home'
input_boxes = []
colors = [(56,96,157), (119,202,234), (167,235,254), (0,47,119), (0,29,73)]
rended = False
scroll_wheel = 0
floors = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
clicked = None
key = None
first = True
last = None

# -------------- PAGES --------------
def home(screen):
    screen.fill((255,255,255))
    # load title image as background
    title = pygame.image.load('./interface/images/title.png')
    screen.blit(title, (0, 0))
    # write title
    title = title_font.render('SquIrrel', True, (255, 255, 255))
    title2 = title_font.render('SpAce', True, (255, 255, 255))
    screen.blit(title, (800, 180))
    screen.blit(title2, (800, 360))
    # begin text
    begin = begin_font.render('BegIn', True, (255, 255, 255))
    screen.blit(begin, (1110, 760))

def new_building(screen):
    screen.fill((255,255,255))
    # load new-building image as background
    new_building = pygame.image.load('./interface/images/new-building.png')
    screen.blit(new_building, (0, 0))
    # draw the new new building text    
    new_building_text = medium.render('New BuIldIng', True, colors[4])
    screen.blit(new_building_text, (210, 385))

def team_input_choice(screen):
    global input_boxes
    screen.fill((255,255,255))
    # load team-input-choice image as background
    team_input_choice = pygame.image.load('./interface/images/team-input-choice.jpg')
    screen.blit(team_input_choice, (0, 0))
    # write on text
    uploadCSV = small.render('Upload JSON', True, (255, 255, 255))
    screen.blit(uploadCSV, (1370, 825))

    # write the intruction text
    instruction1 = small4.render("HI! Welcome to the setup wIzard, ", True, (255,255,255))
    instruction2 = small4.render("manually enter your teams or upload a ", True, (255, 255, 255))
    instruction3 = small4.render("JSON fIle wIth your teams", True, (255, 255, 255))
    screen.blit(instruction1, (700, 250))
    screen.blit(instruction2, (700, 300))
    screen.blit(instruction3, (700, 350))
    # screen.blit(instruction4, (700, 400))
    # screen.blit(instruction5, (700, 450))

def building_input_choice(screen):
    screen.fill((255,255,255))
    # load building-input-choice image as background
    building_input_choice = pygame.image.load('./interface/images/building-input-choice.png')
    screen.blit(building_input_choice, (0, 0))
    # write on text
    uploadCSV = small.render('Upload JSON', True, (255, 255, 255))
    screen.blit(uploadCSV, (820, 825))

    # write the intruction text
    instruction1 = small4.render("Welcome to the setup archItect! Now ", True, (255,255,255))
    instruction2 = small4.render("enter your buIldIng specIfIcatIons ", True, (255, 255, 255))
    instruction3 = small4.render("or upload a JSON ", True, (255, 255, 255))
    screen.blit(instruction1, (150, 250))
    screen.blit(instruction2, (150, 300))
    screen.blit(instruction3, (150, 350))
    # screen.blit(instruction4, (150, 400))
    # screen.blit(instruction5, (150, 450))
    
def blueprint(screen):
    screen.fill((255, 255, 255))
    # load blueprint image as background
    blueprint = pygame.image.load('./interface/images/blueprint.png')
    screen.blit(blueprint, (0, 0))
    paws = pygame.image.load('./interface/images/paws.png')
    screen.blit(paws, (0, 0))

def explaination(screen):
    screen.fill((255, 255, 255))
    # load explaination image as background
    explaination = pygame.image.load('./interface/images/explaination.png')
    screen.blit(explaination, (0, 0))

    fitness = check_fitness(read_output(),1,1)

    instruction1 = small4.render("After lookIng through 3,840,000 ", True, (255,255,255))
    instruction2 = small4.render("possIble arrangements, I have come      ", True, (255, 255, 255))
    instruction3 = small4.render(f"up wIth the best possIble solutIon", True, (255, 255, 255))
    instruction4 = small4.render("ClIck contInue to vIew the blueprInt", True, (255, 255, 255))
    screen.blit(instruction1, (150, 250))
    screen.blit(instruction2, (150, 300))
    screen.blit(instruction3, (150, 350))
    screen.blit(instruction4, (150, 400))

    begin = begin_font.render('ContInue', True, (255, 255, 255))
    screen.blit(begin, (458, 760))
    

def transition(screen):
    # display the animated png
    screen.fill((255, 255, 255))
    # load transition image as background
    transition = pygame.image.load('./interface/images/transition.png')
    screen.blit(transition, (0, 0))

def detailed_view(screen):
    global clicked
    screen.fill((255, 255, 255))
    # load detailed-view image as background
    detailed_view = pygame.image.load('./interface/images/detailed-view.png')
    screen.blit(detailed_view, (0, 0))

# -------------- MAIN LOOP --------------
while True:
    if not page_state == last:
        # time.sleep(.1)
        pass
    last = page_state
    
    if first:
        fig, ax = plt.subplots()
        first = False

    events = pygame.event.get()
    for event in events:
        if event.type == QUIT:
            pygame.quit()
            exit()
    for box in input_boxes:
        box.update(events)
        screen.blit(box.surface, (100, 100))


    mouse = pygame.mouse.get_pos()
    click = pygame.mouse.get_pressed()
        

    match page_state:
        case 'home':
            home(screen)
            if (click[0]):
                if 900 < mouse[0] < 1600 and 750 < mouse[1] < 850:
                    page_state = 'new_building'
        case 'new_building':
            if (click[0]):
                if 120 < mouse[0] < 620 and 120 < mouse[1] < 620:
                    page_state = 'team_input_choice'
            new_building(screen)
        case 'team_input_choice':
            team_input_choice(screen)
            if not rended:
                text_input = TextInput(770, 770, 400, 140, color=(255,255,255), init_text="How many teams?")
                rended = True
                text_input.update_text('Enter how many teams')
            
            for event in events:
                if event.type == pygame.MOUSEBUTTONDOWN:
                    if text_input.clicked(mouse):
                        text_input.isSelected = True
                        text_input.update_text('')
                    else:
                        text_input.isSelected = False
                elif event.type == pygame.KEYDOWN and text_input.isSelected:
                    if event.key == pygame.K_BACKSPACE:
                        text_input.update_text(text_input.text_value[:-1])
                elif event.type == pygame.TEXTINPUT and text_input.isSelected:
                    text_input.update_text(text_input.text_value + event.text)
            text_input.render(screen, False)
            text_input.update(mouse)

            # read csv button
            if (click[0]):
                if 1300 < mouse[0] < 1850 and 750 < mouse[1] < 900:
                    page_state = 'building_input_choice'
                    rended = False
        case 'building_input_choice':
            building_input_choice(screen)
            if not rended:
                text_input = TextInput(180, 770, 400, 140, color=(255,255,255), init_text="How many buildIngs?")
                rended = True
                text_input.update_text('Enter how many buildIngs')
            
            for event in events:
                if event.type == pygame.MOUSEBUTTONDOWN:
                    if text_input.clicked(mouse):
                        text_input.isSelected = True
                        text_input.update_text('')
                    else:
                        text_input.isSelected = False
                elif event.type == pygame.KEYDOWN and text_input.isSelected:
                    if event.key == pygame.K_BACKSPACE:
                        text_input.update_text(text_input.text_value[:-1])
                elif event.type == pygame.TEXTINPUT and text_input.isSelected:
                    text_input.update_text(text_input.text_value + event.text)
                
            text_input.render(screen, False)
            text_input.update(mouse)

            # read csv button
            if (click[0]):
                if 820 < mouse[0] < 1220 and 825 < mouse[1] < 970:
                    page_state = 'explaination'
                    rended = False
        case 'transition':
            for i in range(1, 20):
                # load image
                img = pygame.image.load(f'./interface/images/frames/frame_{str(i).zfill(2)}_delay-0.08s.gif')
                # display image
                screen.blit(img, (0, 0))
                # update screen
                pygame.display.update()
                # wait 0.08 seconds
                time.sleep(0.08)
            page_state = 'blueprint'
        case 'blueprint':
            blueprint(screen)
            percents = percents_full()
            
            for event in events:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_DOWN:
                        scroll_wheel += 1
                        if scroll_wheel > 2: scroll_wheel = 2
                    if event.key == pygame.K_UP:
                        scroll_wheel -= 1
                        if scroll_wheel < 0: scroll_wheel = 0

            # draw the scroll circle
            pygame.draw.circle(screen, colors[2], (1497, 200 + scroll_wheel * 338), 20)

            to_display = [0 + 1*scroll_wheel, 1 + 1*scroll_wheel, 2 + 1*scroll_wheel]
            percents_to_display = [percents[f][3] for f in to_display]
            
            # draw the bars
            for i in range(3):
                pygame.draw.rect(screen, colors[1], (385, 285 + i * 203.5, percents_to_display[i]*600, 164))
                # write the text
                text = small.render(f'{int(percents_to_display[i]*100)}%', True, (255, 255, 255))
                screen.blit(text, (250 + percents_to_display[i]*600, 295 + i * 203.5 + 50))
                # write the team name
                name = f'Floor {floors[to_display[i]]}'
                text = medium.render(name, True, (255, 255, 255))
                screen.blit(text, (400, 285 + i * 203.5 + 50))
                # team names
                teams = read_output()[floors[to_display[i]]][1]
                # write the team names
                for j in range(len(teams)):
                    text = smaller.render(f'Team {teams[j]}', True, (255, 255, 255))
                    text = pygame.transform.rotate(text, 20)
                    screen.blit(text, (1000, 165 + i * 203.5 + 100 + j * 30))

            # check for clicks on bars
            if (click[0]):
                check = False
                if 385 < mouse[0] < 985 and 285 < mouse[1] < 449:
                    clicked =1 
                    check = True
                if 385 < mouse[0] < 985 and 488.5 < mouse[1] < 652.5:
                    clicked = 2
                    check = True
                if 385 < mouse[0] < 985 and 692 < mouse[1] < 856:
                    clicked = 3
                    check = True

                if check:
                    clicked = floors[clicked - 1 + 1*scroll_wheel]
                    page_state = 'detailed_view'
                    rended = False   
        case 'explaination':
            explaination(screen)
            if click[0]:
                if mouse[0] > 400 and mouse[0] < 900 and mouse[1] > 700 and mouse[1] < 900:
                    page_state = 'transition'
                    rended = False
        case 'detailed_view':
            detailed_view(screen)
            # make the pie chart
            if not rended:
                keys = pcm.make_py_chart(clicked)
                rended = True
            
            # if up or ddown change the view in focus
            for event in events:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_DOWN:
                        clicked = floors[floors.index(clicked) + 1]
                        if clicked == 'F': clicked = 'E'
                        
                    if event.key == pygame.K_UP:
                        clicked = floors[floors.index(clicked) - 1]
                        if clicked == "Z": clicked = 'A'
                    

                    keys = pcm.make_py_chart(clicked)

            # load the piechart 
            piechart = pygame.image.load('./interface/images/piechart.png')
            piechart = pygame.transform.scale(piechart, (695, 700))
            screen.blit(piechart, (200, 82))

            keys = [(k[0], int(k[1])) for k in keys]
            # sort by values
            keys = sorted(keys, key=lambda x: x[1], reverse=True)

            for i, key in enumerate(keys):
                # write draw a rectangle
                pygame.draw.rect(screen, hex_to_rgb(key[0]), (330, 725 + i * 50, 35, 35))
                # write the text
                
                if key[1] == -1:
                    name = "Unfilled"
                else:
                    name = f'Team {key[1]}   {read_input()["groups"][key[1] - 1][1]} people'
                text = small2.render(name, True, (255, 255, 255))
                screen.blit(text, (400, 725 + i * 50))
            
            floor_name = f'Floor {clicked}'
            text = large.render(floor_name, True, (255, 255, 255))
            screen.blit(text, (1110, 205))
            interactions = check_interactions(read_output())[clicked]
            
            # write out the header
            text = medium.render('Interactions', True, (255, 255, 255))
            screen.blit(text, (1110, 500))
            text = small.render("      Possitive      |      Negative", True, (255, 255, 255))
            screen.blit(text, (900, 600))

            # write out the interactions
            for i, pos in enumerate(interactions[0]):
                text = smaller2.render(f'{pos}', True, (255, 255, 255))
                screen.blit(text, (930, 650 + i * 40))
            for i, neg in enumerate(interactions[1]):
                text = smaller2.render(f'{neg}', True, (255, 255, 255))
                screen.blit(text, (1270, 650 + i * 40))
            
            # get the percent of the room filled

            total = read_input()['floors'][floors.index(clicked)][1]
            seats = read_output()[clicked][0]
            text = small3.render(f'{seats} spaces unfilled', True, (255, 255, 255))
            screen.blit(text, (283, 145))
            text = small3.render(f'{total} total', True, (255, 255, 255))
            screen.blit(text, (283, 175))

            # draw on paws
            paws = pygame.image.load('./interface/images/paws.png')
            screen.blit(paws, (0, 0))


            # load back button
            back = pygame.image.load('./interface/images/back.png')
            # scale to .75 of original size
            back = pygame.transform.scale(back, (int(back.get_width()*.75), int(back.get_height()*.75)))
            screen.blit(back, (1700, 0))
            # check for clicks on back button
            if (click[0]):
                if 1700 < mouse[0] < 1700 + back.get_width() and 0 < mouse[1] < 0 + back.get_height():
                    page_state = 'blueprint'
                    rended = False
                    clicked = 0


    pygame.display.update()