import csv
import numpy as np
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn import metrics

X = np.array([])
Y = np.array([])
gnb = MultinomialNB()

with open("../data/dataset.csv", mode="r") as file:
    csvFile = csv.reader(file)
    for vals in csvFile:
        if (len(vals) == 0): 
            continue
        data = np.append(X, vals[0])
        target = np.array(Y.tolist() + [[vals[1],vals[2],vals[3]]])


gnb.fit(X, Y)
print(gnb.predict(X[2]))
# print("pred = %s     real = %s" % (str(y_pred), str(Y)))


