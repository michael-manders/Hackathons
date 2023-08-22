from random import randint, random


def offsets(tons):
    costs = {
        "protecting Brazil's rainforests": 12,
        "reforestation in the Uk": 13.5
    }
    methods = list(costs.keys())
    method = methods[randint(0,1)]
    cost = round(costs[method] * tons)
    return (cost, method)
