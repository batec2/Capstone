# Python program to convert 
# numpy array to image 

import numpy as np 
import math
from PIL import Image as im
from FileRead import file_read
import os

def main():

    x_collection, y_collection = file_read()

    print("Dataset size: " + str(len(x_collection)))

    imageFolderString = r"C:\Users\jason\OneDrive\Desktop\Programming Projects\MouseMovement\MouseDataNew\ArrayImages_28x28_Bold"
    labelFolderString = r"C:\Users\jason\OneDrive\Desktop\Programming Projects\MouseMovement\MouseDataNew"

    os.chdir(imageFolderString)
    print("Saving images to: " + os.getcwd())

    os.chdir(labelFolderString)
    print("Saving labels to: " + os.getcwd() + r"\ArrayImagesLabels.txt")

    if os.path.exists("ArrayImagesLabels.txt"):
        os.remove("ArrayImagesLabels.txt")
    
    os.chdir(imageFolderString)

    counter = 1

    for i in range(len(x_collection)-1):

        if len(x_collection[i]) > 0:

            imageArray = np.full([28, 28], 255, dtype=np.uint8)

            start_x = x_collection[i][0]
            start_y = y_collection[i][0]

            end_x = x_collection[i][len(x_collection[i])-1]
            end_y = y_collection[i][len(y_collection[i])-1]

            delta_x = start_x - end_x
            delta_y = start_y - end_y

            angle = math.degrees(math.atan2(delta_y, delta_x))

            if angle < 0:
                angle = angle + 360
            
            imageLabel = getLabel(angle)


            for j in range(len(x_collection[i])-1):

                '''
                x_val = int((x_collection[i][j])//11)
                y_val = int((y_collection[i][j])//7)
                '''

                '''
                x_val = int((x_collection[i][j])//22)
                y_vval = int((y_collection[i][j])//14)
                '''

                x_val = int((x_collection[i][j])//43)
                y_val = int((y_collection[i][j])//28)

                imageArray[y_val][x_val] = 0


                try:
                    imageArray[y_val-1][x_val] = 0
                    imageArray[y_val+1][x_val] = 0

                    imageArray[y_val][x_val+1] = 0
                    imageArray[y_val-1][x_val+1] = 0
                    imageArray[y_val+1][x_val+1] = 0

                    imageArray[y_val][x_val-1] = 0
                    imageArray[y_val-1][x_val-1] = 0
                    imageArray[y_val+1][x_val-1] = 0
                except:
                    print("Index error for data: " + str(i))
                

            os.chdir(imageFolderString)

            array_string = str(counter) + ".png"
            imageData = im.fromarray(imageArray)
            imageData.save(array_string)
            counter += 1

            os.chdir(labelFolderString)

            labelsFile = open("ArrayImagesLabels.txt", "a")
            labelsFile.write(imageLabel + "\n")
            labelsFile.close()

            for i in range(3):
                imageArray = np.rot90(imageArray)
                
                angle = angle + 90
                if angle > 360:
                    angle = angle - 360

                imageLabel = getLabel(angle)

                os.chdir(imageFolderString)

                array_string = str(counter) + ".png"
                imageData = im.fromarray(imageArray)
                imageData.save(array_string)
                counter += 1

                os.chdir(labelFolderString)

                labelsFile = open("ArrayImagesLabels.txt", "a")
                labelsFile.write(imageLabel + "\n")
                labelsFile.close()

    print("Total images generated: " + str(counter-1))


def getLabel(angle):

    imageLabel = ""

    if angle <= 36:
        imageLabel = "1"
    elif (36 < angle) and (angle <= 72):
        imageLabel = "2"
    elif (72 < angle) and (angle <= 108):
        imageLabel = "3"
    elif (108 < angle) and (angle <= 144):
        imageLabel = "4"
    elif (144 < angle) and (angle <= 180):
        imageLabel = "5"
    elif (180 < angle) and (angle <= 216):
        imageLabel = "6"
    elif (216 < angle) and (angle <= 252):
        imageLabel = "7"
    elif (252 < angle) and (angle <= 288):
        imageLabel = "8"
    elif (288 < angle) and (angle <= 324):
        imageLabel = "9"      
    else:
        imageLabel = "10"

    return imageLabel


if __name__ == "__main__": 

  main() 