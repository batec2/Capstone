import os
import PIL
from PIL import ImageFilter
from PIL import Image as im

imageFolderString = r"C:\Users\jason\OneDrive\Desktop\Programming Projects\MouseMovement"
os.chdir(imageFolderString)

image = im.open("noise_test_2.png").convert('RGB')
image.show()

im1 = image.filter(ImageFilter.BLUR)
im1.show()

im2 = image.filter(ImageFilter.MinFilter(3))
im2.show()

im3 = image.filter(ImageFilter.MinFilter)
im3.show()

im4 = image.filter(ImageFilter.GaussianBlur)
im4.show()

im5 = image.filter(ImageFilter.MaxFilter)
im5.show()

im6 = image.filter(ImageFilter.MedianFilter)
im6.show()

im7 = image.filter(ImageFilter.ModeFilter)
im7.show()

im8 = image.filter(ImageFilter.ModeFilter(3))
im8.show()

im9 = image.filter(ImageFilter.ModeFilter(1))
im9.show()

im10 = image.filter(ImageFilter.SHARPEN)
im10.show()

im11 = image.filter(ImageFilter.CONTOUR)
im11.show()

im12 = image.filter(ImageFilter.DETAIL)
im12.show()

im13 = image.filter(ImageFilter.EDGE_ENHANCE)
im13.show()

im14 = image.filter(ImageFilter.EDGE_ENHANCE_MORE)
im14.show()

im15 = image.filter(ImageFilter.EMBOSS)
im15.show()

im16 = image.filter(ImageFilter.FIND_EDGES)
im16.show()

im17 = image.filter(ImageFilter.SMOOTH)
im17.show()

im18 = image.filter(ImageFilter.SMOOTH_MORE)
im18.show()