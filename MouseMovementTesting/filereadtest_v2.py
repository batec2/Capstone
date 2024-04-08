import sys, os
import numpy as nm
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics import r2_score
import tensorflow as tf

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
    print("count: " + str(len(lines)))

    for line in lines:
        x_values.clear()
        y_values.clear()
        line = line[1:-2]
        #line.replace("\n", "")
        split_line = line.split("),")

        for i in range(len(split_line)-1):
            split_line[i] = split_line[i] + ")"
        
        for i in range(1, len(split_line)-1):
            split_line[i] = split_line[i][1:]
        
        #split_line[-1] = split_line[-1][1:]

        for i in range(len(split_line)-1):
            split_line[i] = split_line[i][1:-1]
            x_y_split = split_line[i].split(", ")
            x_values.append(int(x_y_split[0]))
            y_values.append(int(x_y_split[1]))

        x_collection.append(x_values.copy())
        y_collection.append(y_values.copy())

except:
    print("An error occurred with: 'mouse_data.txt'.")

""" for i in range(15):
    mymodel = nm.poly1d(nm.polyfit(x_collection[i], y_collection[i], 15))
    myline = nm.linspace(x_collection[i][0], x_collection[i][-1], y_collection[i][-1])

    plt.scatter(x_collection[i], y_collection[i])
    plt.plot(myline, mymodel(myline))
    plt.show()

    print(x_collection[i])
    print(y_collection[i])

    print(r2_score(y_collection[i], mymodel(x_collection[i]))) """

tf.compat.v1.disable_eager_execution()

X = tf.compat.v1.placeholder("float")
Y = tf.compat.v1.placeholder("float")

learning_rate = 0.2
no_of_epochs = 1

a = tf.Variable(nm.random.randn(), name = "a")
b = tf.Variable(nm.random.randn(), name = "b")
c = tf.Variable(nm.random.randn(), name = "c")
d = tf.Variable(nm.random.randn(), name = "d")
e = tf.Variable(nm.random.randn(), name = "e")
f = tf.Variable(nm.random.randn(), name = "f")
g = tf.Variable(nm.random.randn(), name = "g")
h = tf.Variable(nm.random.randn(), name = "h")
i = tf.Variable(nm.random.randn(), name = "i")
j = tf.Variable(nm.random.randn(), name = "j")
k = tf.Variable(nm.random.randn(), name = "k")
l = tf.Variable(nm.random.randn(), name = "l")
m = tf.Variable(nm.random.randn(), name = "m")
n = tf.Variable(nm.random.randn(), name = "n")
o = tf.Variable(nm.random.randn(), name = "o")
p = tf.Variable(nm.random.randn(), name = "p")

deg15 = a*tf.pow(X,15) + b*tf.pow(X,14) + c*tf.pow(X,13) + d*tf.pow(X,12) + e*tf.pow(X,11) + f*tf.pow(X,10) + g*tf.pow(X,9) + h*tf.pow(X,8) + i*tf.pow(X,7) + j*tf.pow(X,6) + k*tf.pow(X,5) + l*tf.pow(X,4) + m*tf.pow(X,3) + n*tf.pow(X,2) + o*X + p
mse15 = tf.reduce_sum(tf.pow(deg15-Y,2))/(2*n)
optimizer15 = tf.compat.v1.train.AdamOptimizer(learning_rate).minimize(mse15)
init=tf.compat.v1.global_variables_initializer()

with tf.compat.v1.Session() as sess:
    sess.run(init)
    for epoch in range(no_of_epochs):
      print("epoch: " + str(epoch))
      for i in range (len(x_collection)-1):
        for (x,y) in zip(x_collection[i], y_collection[i]):
            sess.run(optimizer15, feed_dict={X:x, Y:y})
      if (epoch+1)%1000==0:
        cost = sess.run(mse15,feed_dict={X:x_collection,Y:y_collection})
        print("Epoch",(epoch+1), ": Training Cost:", cost," a,b,c,d,e,fg,h,i,j,k,l,m,n,o,p:",sess.run(a),sess.run(b),sess.run(c),sess.run(d),sess.run(e),sess.run(f),sess.run(g),sess.run(h),sess.run(i),sess.run(j),sess.run(k),sess.run(l),sess.run(m),sess.run(n),sess.run(o),sess.run(p))

        training_cost = sess.run(mse15,feed_dict={X:x_collection,Y:y_collection})
        coefficient1 = sess.run(a)
        coefficient2 = sess.run(b)
        coefficient3 = sess.run(c)
        coefficient4 = sess.run(d)
        coefficient5 = sess.run(e)
        coefficient6 = sess.run(f)
        coefficient7 = sess.run(g)
        coefficient8 = sess.run(h)
        coefficient9 = sess.run(i)
        coefficient10 = sess.run(j)
        coefficient11 = sess.run(k)
        coefficient12 = sess.run(l)
        coefficient13 = sess.run(m)
        coefficient14 = sess.run(n)
        coefficient15 = sess.run(p)
        constant = sess.run(p)

        print(training_cost, coefficient1, constant)


predictions = []
for x in x_collection[0]:
  predictions.append((coefficient1*pow(x,15) + coefficient2*pow(x,14) + coefficient3*pow(x,13) + coefficient4*pow(x,12) + coefficient5*pow(x,11) + coefficient6*pow(x,10) + coefficient7*pow(x,9) + coefficient8*pow(x,8) + coefficient9*pow(x,7) + coefficient10*pow(x,6) + coefficient11*pow(x,5) + coefficient12*pow(x,4) + coefficient13*pow(x,3) + coefficient14*pow(x,2) + coefficient15*x + constant))
plt.plot(x_collection[0], y_collection[0], 'ro', label ='Original data')
plt.plot(x_collection[0], predictions, label ='Fitted line')
plt.title('15-th degree polynomial Regression Result')
plt.legend()
plt.show()


#print(x_collection)
#print(y_collection)