import json
import os, random, sys
import itertools
from utils import *


def bin_packing(groups, floors_dict):
    for group in groups:
        # find the floor with the most space
        floor = max(floors_dict, key=lambda x: floors_dict[x][0])
        floors_dict[floor][1].append(group[0])
        floors_dict[floor][0] -= group[1]

    return floors_dict

def check_over_capacity(floors_dict):
    for floor in floors_dict:
        if floors_dict[floor][0] < 0:
            return True
    return False


def solve(pos, neg):
    # load input.json
    with open(os.path.join(os.path.dirname(__file__), 'input.json')) as f:
        input = json.load(f)

    groups = input['groups']
    floors_list = input['floors']

    # print(groups)

    floors_dict = {floor[0]: [floor[1], []] for floor in floors_list}


    possible_groups = list(itertools.permutations(groups))
    plans_that_work = []

    length = len(possible_groups)
    for i, group in enumerate(possible_groups):
        if i % 5837 == 0:
            print(f"{i} / {length} | {round(i/length*100, 2)}%")
        floors_dict = bin_packing(group, floors_dict)
        if not check_over_capacity(floors_dict):
            plans_that_work.append(floors_dict.copy())
        floors_dict = {floor[0]: [floor[1], []] for floor in floors_list}

    print("checking fitness")
    fittest = plans_that_work[0]

    for plan in plans_that_work:
        if check_fitness(plan, pos, neg) > check_fitness(fittest, pos, neg):
            fittest = plan

    # print(groups)
    # print(floors_list)

    print(fittest)
    print(check_fitness(fittest, pos, neg))

    # save output.json
    with open(os.path.join(os.path.dirname(__file__), 'output.json'), 'w') as f:
        json.dump(fittest, f)


if __name__ == '__main__':
    solve(1, 1)