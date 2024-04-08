import pygame, sys, os
from pygame.locals import *
import random

import PolynomialRegession
from WindMouse import wind_mouse
import numpy as np
import time

pygame.init()

# FPS constants 
FPS = 60
FramePerSec = pygame.time.Clock()

# Colours
BLUE = (0, 0, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
LIGHT_GRAY = (230, 230, 230)
ORANGE = (255, 165, 0)
CYAN = (0, 206, 209)

# Screen constants
SCREEN_WIDTH = 1200
SCREEN_HEIGHT = 775
SPACING = 40

# Panel constants
PANEL_UX = 10
PANEL_UY = 10
PANEL_LX = PANEL_UX + 90
PANEL_LY = SCREEN_HEIGHT - 20

# Button constants
BUTTON_W = 90
BUTTON_H = 40

# Start and end square constants
SQUARE_W = 40
SQUARE_H = 40

# Panel button constants
PANEL_LEFT = 15
QUIT_TOP = 715
RECORD_TOP = 20
STOP_TOP = 65
DISPLAY_TOP = 192
CLEAR_TOP = 237
ADD_TOP = 282
RANDOM_TOP = 409
NUMPY_TOP = 454
SAVE_TOP = 611

# Initialize screen 
DISPLAYSURF = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
DISPLAYSURF.fill(WHITE)
pygame.display.set_caption("DataClient")

def random_coords():
    # get random x-and-y-coordinates for start and end point buttons
    green_y = random.randint(10, SCREEN_HEIGHT - (BUTTON_H + 10))
    red_y = random.randint(10, SCREEN_HEIGHT - (BUTTON_H + 10))

    green_x = random.randint(PANEL_LX + SPACING, SCREEN_WIDTH - (SPACING * 2))
    red_x = random.randint(PANEL_LX + SPACING, SCREEN_WIDTH - (SPACING * 2))

    while ((green_x <= red_x <= green_x + BUTTON_W) and (green_y <= red_y <= green_y + BUTTON_H)):
        # make sure the buttons don't overlap
        red_x = random.randint(PANEL_LX + SPACING, SCREEN_WIDTH - (SPACING * 2))
    
    return green_y, green_x, red_y, red_x


def main():

    # Starting Strings
    pygame.font.init()
    test_font = pygame.font.SysFont("Arial", 20)
    click_status = test_font.render("Status: Not Recording", False, (0,0,0))
    quit_text = test_font.render("QUIT", False, (0,0,0))
    record_text = test_font.render("RECORD", False, (0,0,0))
    stop_text = test_font.render("STOP", False, (0,0,0))
    display_text = test_font.render("DISPLAY", False, (0,0,0))
    clear_text = test_font.render("CLEAR", False, (0,0,0))
    add_text = test_font.render("ADD", False, (0,0,0))
    random_text = test_font.render("RANDOM", False, (0,0,0))
    save_text = test_font.render("SAVE", False, (0,0,0))
    numpy_text = test_font.render("NUMPY", False, (0,0,0))

    # Randomize starting x-and-y-coordinates for start-point and end-point button positions
    green_x = PANEL_LX + SPACING
    green_y = (SCREEN_HEIGHT / 2) - SPACING

    red_x = SCREEN_WIDTH - (SPACING * 2)
    red_y = (SCREEN_HEIGHT / 2) - SPACING

    # Boolean variables
    record = False
    start_clicked = False
    display = False
    gravity = False

    # Declare lists
    x_y_list = []
    x_y_time_list = []
    mouse_data_collection = []
    mouse_time_data_collection = []

    # Main loop 
    while True:

            for event in pygame.event.get():              
                if event.type == QUIT:
                    pygame.quit()
                    sys.exit()
                if event.type == pygame.MOUSEBUTTONUP:

                    if ((event.button == 3) and (len(x_y_list) > 0)):
                        add_regular = x_y_list.copy()
                        mouse_data_collection.append(add_regular)

                        add_time = x_y_time_list.copy()
                        mouse_time_data_collection.append(add_time)

                        x_y_list.clear()
                        x_y_time_list.clear()

                        green_y, green_x, red_y, red_x = random_coords()

                    x, y = pygame.mouse.get_pos()

                    if ((green_x <= x <= (green_x + 40)) and (green_y <= y <= (green_y + 40)) and (record == True)):
                        x_y_list.clear()
                        x_y_time_list.clear()
                        start_time = float(time.time())
                        display = False
                        start_clicked = True
                    
                    elif ((red_x <= x <= (red_x + 40)) and (red_y <= y <= (red_y + 40)) and (start_clicked == True)):
                        start_clicked = False
                    
                    elif (PANEL_LEFT <= x <= (PANEL_LEFT + BUTTON_W)):
                        
                        if (QUIT_TOP <= y <= (QUIT_TOP + BUTTON_H)):
                            pygame.quit()
                            sys.exit()
                        
                        elif (RECORD_TOP <= y <= (RECORD_TOP + BUTTON_H)):
                            record = True
                            click_status = test_font.render("Status: RECORDING", False, RED)
                        
                        elif (STOP_TOP <= y <= (STOP_TOP + BUTTON_H)):
                            record = False
                            click_status = test_font.render("Status: Not Recording", False, (0,0,0))
                        
                        elif (DISPLAY_TOP <= y <= (DISPLAY_TOP + BUTTON_H)):
                            if len(x_y_list) > 0:
                                display = True
                        
                        elif (CLEAR_TOP <= y <= (CLEAR_TOP + BUTTON_H)):
                            display = False
                            gravity = False
                        
                        elif ((ADD_TOP <= y <= (ADD_TOP + BUTTON_H)) and (len(x_y_list) > 0)):

                            add_regular = x_y_list.copy()
                            mouse_data_collection.append(add_regular)

                            add_time = x_y_time_list.copy()
                            mouse_time_data_collection.append(add_time)

                            x_y_list.clear()
                            x_y_time_list.clear()

                            green_y, green_x, red_y, red_x = random_coords()
                        
                        elif (RANDOM_TOP <= y <= (RANDOM_TOP + BUTTON_H)):
                            green_y, green_x, red_y, red_x = random_coords()
                            
                        elif (NUMPY_TOP <= y <= (NUMPY_TOP + BUTTON_H)):
                            gravity = True

                            for y in np.linspace((green_y+(SQUARE_H/2)),(red_y+(SQUARE_H/2)),1):
                                points = []
                                wind_mouse((green_x+(SQUARE_W/2)), (green_y+(SQUARE_H/2)), (red_x+(SQUARE_W/2)), (red_y+(SQUARE_H/2)), G_0=5, W_0=5, M_0=20, D_0=25, move_mouse=lambda a,b: points.append([a,b]))
                                print(points)


                        elif ((SAVE_TOP <= y <= (SAVE_TOP + BUTTON_H)) and (len(mouse_data_collection) > 0)):
                            os.chdir(r"C:\Users\jason\OneDrive\Desktop\Programming Projects\MouseMovement")
                            print(os.getcwd())

                            # mouse data without time
                            try:
                                file = open("mouse_data.txt", "x")
                                file.close()
                            except:
                                print("File already exists.")
                            
                            try:
                                file = open('mouse_data.txt', "a+")
                                print("'mouse_data.txt' Open Success")

                                count = 0

                                for list in mouse_data_collection:
                                    count += 1
                                    file.write(str(list) + "\n")
                                    print("Writing..." + str(count))
                                
                                file.close()
                                print("Write Success")

                                mouse_data_collection.clear()

                            except:
                                print("An error occurred with: 'mouse_data.txt'.")
                            
                            # mouse data with time
                            try:
                                file = open("mouse_time_data.txt", "x")
                                file.close()
                            except:
                                print("File already exists.")
                            
                            try:
                                file = open('mouse_time_data.txt', "a+")
                                print("'mouse_time_data.txt' Open Success")

                                count = 0

                                for list in mouse_time_data_collection:
                                    count += 1
                                    file.write(str(list) + "\n")
                                    print("Writing..." + str(count))
                                
                                file.close()
                                print("Write Success")

                                mouse_time_data_collection.clear()

                            except:
                                print("An error occurred with: 'mouse_time_data.txt'.")

            # Display current mouse position
            x, y = pygame.mouse.get_pos()
            position_text = test_font.render("Pos: " + str(x) + ", " + str(y), False, (0, 0, 0))

            # Add point to the x_y_list
            if start_clicked == True:
                delta = float(time.time()) - start_time

                x_y_list.append((x, y))
                x_y_time_list.append((x, y, delta))

            DISPLAYSURF.fill(WHITE)

            # Draw panel
            pygame.draw.rect(DISPLAYSURF, LIGHT_GRAY, [PANEL_UX, PANEL_UY, PANEL_LX, PANEL_LY])
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_UX, PANEL_UY, PANEL_LX, PANEL_LY], 2)

            # Draw start and end dquares
            pygame.draw.rect(DISPLAYSURF, GREEN, [green_x, green_y, SQUARE_W, SQUARE_H])
            pygame.draw.rect(DISPLAYSURF, RED, [red_x, red_y, SQUARE_W, SQUARE_H])

            # Display previously recorded points
            if display == True:
                for item in x_y_list:
                    (curr_x, curr_y) = item
                    pygame.draw.ellipse(DISPLAYSURF, BLUE, [curr_x, curr_y, 5, 5])
            
            # Display WindMouse generated points
            if gravity == True:
                print(points)

                for point in points:
                    pygame.draw.ellipse(DISPLAYSURF, CYAN, [point[0], point[1], 5, 5])



            # Poisition and click status text
            DISPLAYSURF.blit(position_text, (425, 10))
            DISPLAYSURF.blit(click_status, (425, 35))
            
            # Quit button
            DISPLAYSURF.blit(quit_text, (40, 722))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, QUIT_TOP, BUTTON_W, BUTTON_H], 2)

            # Record button
            DISPLAYSURF.blit(record_text, (23, 29))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, RECORD_TOP, BUTTON_W, BUTTON_H], 2)

            # Stop button
            DISPLAYSURF.blit(stop_text, (39, 74))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, STOP_TOP, BUTTON_W, BUTTON_H], 2)

            # Display button
            DISPLAYSURF.blit(display_text, (25, 200))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, DISPLAY_TOP, BUTTON_W, BUTTON_H], 2)

            # Clear button
            DISPLAYSURF.blit(clear_text, (31, 245))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, CLEAR_TOP, BUTTON_W, BUTTON_H], 2)

            # Add button
            DISPLAYSURF.blit(add_text, (40, 290))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, ADD_TOP, BUTTON_W, BUTTON_H], 2)

            # Random button
            DISPLAYSURF.blit(random_text, (24, 417))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, RANDOM_TOP, BUTTON_W, BUTTON_H], 2)

            # Save button
            DISPLAYSURF.blit(save_text, (39, 618))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, SAVE_TOP, BUTTON_W, BUTTON_H], 2)

            # Gravity button
            DISPLAYSURF.blit(numpy_text, (23, 462))
            pygame.draw.rect(DISPLAYSURF, BLACK, [PANEL_LEFT, NUMPY_TOP, BUTTON_W, BUTTON_H], 2)
                
            pygame.display.update()
            FramePerSec.tick(FPS)

            # End main loop

if __name__ == '__main__':
    main()