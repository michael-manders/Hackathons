import json, os

def read_input():
    with open(os.path.join(os.path.dirname(__file__), 'input.json')) as f:
        return json.load(f)

def read_output():
    with open(os.path.join(os.path.dirname(__file__), 'output.json')) as f:
        return json.load(f)

def percents_full():
    floors_and_groups = read_input()
    alignment = read_output()
    floors = floors_and_groups['floors']
    groups = floors_and_groups['groups']
    
    floors = [[f[0], f[1], 0, 0] for f in floors]
    floors = [[f[0], f[1], f[1] - alignment[f[0]][0]] for f in floors]
    floors = [[f[0], f[1], f[2], round(f[2]/f[1], 2)] for f in floors]

    return floors
    
def check_fitness(plan, pos, neg):
    groups = read_input()['groups']
    fitness = 0
    for floor in plan:
        for group in plan[floor][1]:
            for group2 in plan[floor][1]:
                group = int(group)
                group2 = int(group2)

                if group in groups[group2 - 1][2]:
                    fitness += pos
                elif group in groups[group2 - 1][3]:
                    fitness -= neg

    return fitness

def check_interactions(plan):
    groups = read_input()['groups']
    floors = read_input()['floors']
    floor_interactions = {f[0]: [[], []] for f in floors}
    for floor in plan:
        for group in plan[floor][1]:
            for group2 in plan[floor][1]:
                if group == group2:
                    continue
                group = int(group)
                group2 = int(group2)

                if group in groups[group2 - 1][2]:
                    floor_interactions[floor][0].append(f'group {group} likes {group2}')
                elif group in groups[group2 - 1][3]:
                    floor_interactions[floor][1].append(f'group {group} dislikes {group2}')
        
        floor_interactions[floor][0] = list(set(floor_interactions[floor][0]))
        floor_interactions[floor][1] = list(set(floor_interactions[floor][1]))
    
    return floor_interactions

def get_percents():
    groups = read_input()['groups']
    floors = read_input()['floors']
    alignment = read_output()

    percents = {f[0]: []  for f in floors}

    for floor in floors:
        letter, total = floor
        for group in alignment[letter][1]:
            percents[letter].append((group, groups[int(group) - 1][1] / total))
        percents[letter].append(("-1", 1 - sum([p[1] for p in percents[letter]])))
        percents[letter].reverse()
    
    return percents