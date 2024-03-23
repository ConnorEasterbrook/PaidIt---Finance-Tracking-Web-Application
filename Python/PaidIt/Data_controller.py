import json
import urllib
import random
from datetime import datetime
import os


def file_exists(data_path):
    if not os.path.exists(data_path):
        with open(data_path, "w") as f:
            f.write('{"Accounts": {}}')
            sanity_check_data(data_path)


def read_json_file(file_path):
    with open(file_path, 'r') as f:
        sanity_check_data(file_path)
        return json.load(f)


def sanity_check_data(data_path):
    with open(data_path, "r") as f:
        data = json.load(f)

    if data is None or "Accounts" not in data:
        data = {"Accounts": {}}

    if not isinstance(data["Accounts"], dict):
        return "Error: Accounts must be a dictionary"

    for account_name in data["Accounts"]:
        if "Inputs" not in data["Accounts"][account_name]:
            data["Accounts"][account_name]["Inputs"] = []

        if "Colour" not in data["Accounts"][account_name]:
            random_color = "#{:06x}".format(random.randint(0, 0xFFFFFF))
            data["Accounts"][account_name]["Colour"] = random_color

    write_json_file(data_path, data)


def write_json_file(data_path, data):
    with open(data_path, "w") as f:
        sorted_data = sort_data(data)
        json.dump(sorted_data, f)


def sort_data(data):
    if not data or "Accounts" not in data:
        return data

    if not isinstance(data["Accounts"], dict):
        return data

    # Sort Accounts alphabetically
    sorted_accounts = dict(sorted(data["Accounts"].items()))

    # Sort Inputs by Date
    for account_name, account_data in sorted_accounts.items():
        if "Inputs" not in account_data or not isinstance(account_data["Inputs"], list):
            continue

        account_data["Inputs"].sort(key=lambda x: datetime.strptime(x["Date"], "%Y-%m-%d"))

    data["Accounts"] = sorted_accounts
    return data


### A basic function to retrieve all data from the json file under the "Accounts" key
def get_data_from_json(data_path):
    data = read_json_file(data_path)

    if data is None:
        return "Error reading JSON file"

    if not data["Accounts"]:
        return "No accounts found"

    return data["Accounts"]


### A basic function to add a new user to the json file
def add_bank_account(data_path, account_name):
    data = read_json_file(data_path)

    if data is None or "Accounts" not in data:
        data = {"Accounts": {}}

    if not isinstance(data["Accounts"], dict):
        return "Error: Accounts must be a dictionary"

    if account_name not in data["Accounts"]:
        data["Accounts"][account_name] = {}

    sanity_check_data(data_path)
    write_json_file(data_path, data)


### A basic function to add data to a user in the json file
def add_data_to_account(data_path, account_name, input_date, input_amount):
    with open(data_path, "r") as f:
        data = json.load(f)

    if data is None:
        return "Error reading JSON file"

    if not data["Accounts"]:
        return "No accounts found"

    if account_name not in data["Accounts"]:
        return "Account does not exist"

    account = data["Accounts"][account_name]

    if "Inputs" not in account:
        account["Inputs"] = []

    if input_amount < 0:
        return "Input amount must be positive"

    account["Inputs"].append(
        {
            "Date": input_date,
            "Amount": input_amount
        })

    write_json_file(data_path, data)

    return "Success"
