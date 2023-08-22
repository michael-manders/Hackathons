import csv
import numpy as np
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn import metrics


data = np.array([])
target = np.array([])
gnb = MultinomialNB()

with open("../data/dataset.csv", mode="r") as file:
    csvFile = csv.reader(file)
    for vals in csvFile:
        if (len(vals) == 0): 
            continue
        data = np.append(data, vals[0])
        target = np.array(target.tolist() + [[vals[1],vals[2],vals[3]]])


x_train,x_test,y_train,y_test = train_test_split(data,target,test_size=0.1,random_state=10) # Test size = ratio of dataset used in testing 1 all of if 0 none

gnb.fit(x_train,y_train)

y_pred = gnb.predict(x_test)
print("pred = %s     real = %s" % (str(y_pred), str(y_test)))

metrics.accuracy_score(y_pred, y_test)


