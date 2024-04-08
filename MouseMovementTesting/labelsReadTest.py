import os
from PIL import Image

def readLabelsFile():

    labelsDirectory = r"C:\Users\jason\OneDrive\Desktop\Programming Projects\MouseMovement\MouseDataNew"

    os.chdir(labelsDirectory)

    labelsFile = open("ArrayImagesLabels.txt", "r")

    labelsList = []

    for line in labelsFile:
        line = line.rstrip('\n')
        if (line != "") and (line.isdigit()):
            labelsList.append(line)

    return labelsList

def getImagesArray():

    imagesDirectory = r"C:\Users\jason\OneDrive\Desktop\Programming Projects\MouseMovement\MouseDataNew\ArrayImagesNew"

    os.chdir(imagesDirectory)

    imagesList = []

    filesInDirectory = os.listdir(os.curdir)

    for file in filesInDirectory:
        image = Image.open(os.path.join(imagesDirectory, file))
        imagesList.append(image)

    return imagesList

def main():

    labelsList = readLabelsFile()

    print(len(labelsList))

    imagesList = getImagesArray()

    print(len(imagesList))

if __name__ == '__main__':
    main()