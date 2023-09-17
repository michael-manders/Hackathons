import csv
from dateutil import relativedelta
from datetime import datetime
import json

DATASET_PATH = './dataset.csv'

def calc_inventory(path):
    with open(path, 'r') as f:
        reader = csv.reader(f)
        data = list(reader)

    inventory = []

    for (i, row) in enumerate(data):
        if i == 0:
            continue
        inventory.append(
            {
                "id": int(row[0]),
                "type": str(row[1]),
                "floor": int(row[2]),
                "room":  int(row[3]),
                "installation_date": str(row[4]),
                "manufacturer": str(row[5]),
                "op_time": int(row[6]),
                "work_orders": int(row[7]),
                "repairs": int(row[8]),
                "last_repair_date": str(row[9]),
            }
        )
    
    # calculate the average time between repairs
    for item in inventory:
        if item["repairs"] == 0:
            item["avg_time_between_repairs"] = -1
        else:
            item["avg_time_between_repairs"] = int(item["op_time"]) / int(item["repairs"])
        
    # calculate estimated time to next repair

    today = datetime.today()

    for item in inventory:
        if (item["repairs"] == 0) :
            item["time_until_repair"] = -1
            continue
        
        date = datetime.strptime(item["last_repair_date"], '%m/%d/%Y')
        average_time_between_repairs = item["avg_time_between_repairs"]
        # get time delta in hours
        time_delta = relativedelta.relativedelta(today, date) 
        time_delta_in_hours = time_delta.years * 365 * 24 + time_delta.months * 30 * 24 + time_delta.days * 24 + time_delta.hours

        time_until_repair = average_time_between_repairs - time_delta_in_hours
        item["time_until_repair"] = time_until_repair
    
    return inventory

def calc_manufacturer_reliability():
    inventory = calc_inventory(DATASET_PATH)

    reliability = {}

    for item in inventory :
        if item["type"] not in reliability:
            reliability[item["type"]] = {}

        if item["manufacturer"] not in reliability[item["type"]]:
            reliability[item["type"]][item["manufacturer"]] = {
                "total_repairs": 0,
                "total_op_time": 0,
            }
        
        reliability[item["type"]][item["manufacturer"]]["total_repairs"] += int(item["repairs"])
        reliability[item["type"]][item["manufacturer"]]["total_op_time"] += int(item["op_time"])

    # calculate op_time / repairs
    for item_type in reliability:
        for manufacturer in reliability[item_type]:
            total_repairs = reliability[item_type][manufacturer]["total_repairs"]
            total_op_time = reliability[item_type][manufacturer]["total_op_time"]
            reliability[item_type][manufacturer]["op_time_per_repair"] = total_op_time / total_repairs

    return reliability

def calculate_stats():
    stats = {}

    # calculate average time between repairs for each type of item
    inventory = calc_inventory(DATASET_PATH)
    for item in inventory:
        if item["type"] not in stats:
            stats[item["type"]] = {
                "total_op_time": 0,
                "total_repairs": 0,
            }
        stats[item["type"]]["total_op_time"] += item["op_time"]
        stats[item["type"]]["total_repairs"] += item["repairs"]

    for item_type in stats:
        total_op_time = stats[item_type]["total_op_time"]
        total_repairs = stats[item_type]["total_repairs"]
        stats[item_type]["avg_time_between_repairs"] = total_op_time / total_repairs

    # calculate the total repairs for each manufacturer and the total op time per each manufacturer
    reliability = calc_manufacturer_reliability()
    stats["manufacturers"] = {}

    return stats

def calculate_problematic_months():
    data = {}

    # mark the number of times a service request has been made to each month
    inventory = calc_inventory(DATASET_PATH)
    for item in inventory:
        if item["type"] not in data:
            data[item["type"]] = {}

        date = datetime.strptime(item["last_repair_date"], '%m/%d/%Y')
        month = date.month
        
        if month not in data[item["type"]]:
            data[item["type"]][month] = 0
    
        data[item["type"]][month] += 1
    
    return data

def get_inventory_with_deviations():
    # calculate the sd for each item on average time between repairs against the average time between repairs for the item type
    inventory = calc_inventory(DATASET_PATH)
    stats = calculate_stats()

    for item in inventory:
        item_type = item["type"]
        item["avg_time_between_repairs_for_type"] = stats[item_type]["avg_time_between_repairs"]

        if item["repairs"] == 0:
            item["deviation"] = -1
            continue 

        item["deviation"] = item["avg_time_between_repairs"] - item["avg_time_between_repairs_for_type"]

    return inventory

def sort_by_deviations():
    inventory = get_inventory_with_deviations()
    inventory.sort(key=lambda x: x["deviation"])
    
    # get top 10 and bottom 10 of each category
    top_10 = {}
    bottom_10 = {}

    for item in inventory:
        if item["repairs"] == 0:
            continue

        item_type = item["type"]
        if item_type not in top_10:
            top_10[item_type] = []
            bottom_10[item_type] = []
        
        if len(top_10[item_type]) < 7:
            top_10[item_type].append(item)
        if len(bottom_10[item_type]) < 7:
            bottom_10[item_type].append(item)

    data = {
        "top_10": top_10,
        "bottom_10": bottom_10,
    }

    return data

def get_general_info():
    data = {}

    inventory = calc_inventory(DATASET_PATH)
    data["total_items"] = len(inventory)
    data["manufacturers"] = []
    data["types"] = []

    for item in inventory:
        if item["manufacturer"] not in data["manufacturers"]:
            data["manufacturers"].append(item["manufacturer"])
        if item["type"] not in data["types"]:
            data["types"].append(item["type"])

    return data



def output():
    inventory = get_inventory_with_deviations()
    reliability = calc_manufacturer_reliability()
    stats = calculate_stats()
    problematic_months = calculate_problematic_months()
    outliers = sort_by_deviations()
    general_info = get_general_info()

    data = {
        "inventory": inventory,
        "reliability": reliability,
        "stats": stats,
        "problematic_months": problematic_months,
        "outliers": outliers,
        "general_info": general_info,
    }


    # write to file
    with open('./data.json', 'w') as f:
        f.write(json.dumps(data, indent=4))


if __name__ == "__main__":
    output()