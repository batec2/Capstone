from FileRead import file_read
import numpy as nm
import matplotlib.pyplot as plt
import random
import pandas as pd
from sklearn.metrics import r2_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf


x_collection, y_collection = file_read()
'''
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
viz_polymonial()

'''
'''
for i in range(15):
    mymodel = nm.poly1d(nm.polyfit(x_collection[i], y_collection[i], 15))
    myline = nm.linspace(x_collection[i][0], x_collection[i][-1], y_collection[i][-1])

    plt.scatter(x_collection[i], y_collection[i])
    plt.plot(myline, mymodel(myline))
    plt.show()

    print(x_collection[i])
    print(y_collection[i])

    print(r2_score(y_collection[i], mymodel(x_collection[i])))
'''

def numpy_PolyReg(green_x, green_y, red_x, red_y):

    x_set = []
    y_set = []

    for j in range(15):
        print(j)
        x_curr = []
        y_curr = []

        for k in range(5):
            print(k)
            if green_x <= red_x:
                x_curr.append(random.randint(green_x, red_x))
            else:
                x_curr.append(random.randint(red_x, green_x))

            if green_y <= red_y:
                y_curr.append(random.randint(green_y, red_y))
            else:
                y_curr.append(random.randint(red_y, green_y))

        x_set.append(x_curr)
        y_set.append(y_curr)

    for i in range(15):
        mymodel = nm.poly1d(nm.polyfit(x_set[i], y_set[i], 13))
        myline = nm.linspace(x_set[i][0], x_set[i][-1], y_set[i][-1])

        plt.scatter(x_set[i], y_set[i])
        plt.plot(myline, mymodel(myline))
        plt.show()

        print(x_set[i])
        print(y_set[i])

        print(r2_score(y_set[i], mymodel(x_set[i])))

    return myline, mymodel
