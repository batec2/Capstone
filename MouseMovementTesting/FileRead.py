import sys, os
'''
import numpy as nm
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics import r2_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn.model_selection import train_test_split 
from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
'''

def file_read():

    os.chdir(r"C:\Users\jason\OneDrive\Desktop\Programming Projects\MouseMovement")
    print(os.getcwd())

    x_values = list()
    x_collection = list()
    y_values = list()
    y_collection = list()

    # mouse data without time
    try:
        file = open("mouse_data.txt", "r")
        file.close()
    except:
        print("File does not exist.")

    try:
        file = open('mouse_data.txt', "r")

        lines = file.readlines()

        for line in lines:
            x_values.clear()
            y_values.clear()
            line = line[1:-2]
            split_line = line.split("),")

            for i in range(len(split_line)-1):
                split_line[i] = split_line[i] + ")"
            
            for i in range(1, len(split_line)-1):
                split_line[i] = split_line[i][1:]

            for i in range(len(split_line)-1):
                split_line[i] = split_line[i][1:-1]
                x_y_split = split_line[i].split(", ")
                x_values.append(int(x_y_split[0]))
                y_values.append(int(x_y_split[1]))

            x_collection.append(x_values.copy())
            y_collection.append(y_values.copy())

    except:
        print("An error occurred with: 'mouse_data.txt'.")
    
    return x_collection, y_collection

""" x_collection, y_collection = file_read()

poly_reg = PolynomialFeatures(degree=15)

xy_data = {'x_col': x_collection[0], 'y_col': y_collection[0]}

dataset = pd.DataFrame.from_dict(xy_data)

X = dataset.iloc[:, 0:1].values
y = dataset.iloc[:, 1].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

X_poly = poly_reg.fit_transform(X)
pol_reg = LinearRegression()
pol_reg.fit(X_poly, y)

# Visualizing the Polymonial Regression results
def viz_polymonial():
    plt.scatter(X, y, color='red')
    plt.plot(X, pol_reg.predict(poly_reg.fit_transform(X)), color='blue')
    plt.title('Truth or Bluff (Linear Regression)')
    plt.xlabel('Position level')
    plt.ylabel('Salary')
    plt.show()
    return
viz_polymonial() """

""" for i in range(15):
    mymodel = nm.poly1d(nm.polyfit(x_collection[i], y_collection[i], 15))
    myline = nm.linspace(x_collection[i][0], x_collection[i][-1], y_collection[i][-1])

    plt.scatter(x_collection[i], y_collection[i])
    plt.plot(myline, mymodel(myline))
    plt.show()

    print(x_collection[i])
    print(y_collection[i])

    print(r2_score(y_collection[i], mymodel(x_collection[i]))) """

#print(x_collection)
#print(y_collection)