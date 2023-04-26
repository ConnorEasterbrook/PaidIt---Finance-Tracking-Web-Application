import json
import urllib
from datetime import datetime

### A basic function to read a json file
def read_json_file(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)

        if "Accounts" not in data:
            data = {"Accounts": {}}
            write_json_file(file_path, data)

### A basic function to write a json file
def write_json_file(file_path, data):
    with open(file_path, "w") as f:
        sorted_data = sort_data(data)
        json.dump(sorted_data, f)

### A basic function to retrieve the data from the json file
def get_data_from_json(file_path):
    with open(file_path, "r") as f:
        data = json.load(f)

    json_data = json.dumps(data)

    url = "Home/ChartData"
    headers = {"Content-Type": "application/json"}
    req = urllib.Request(url, json_data, headers)
    response = urllib.urlopen(req)

### A basic function to add a new user to the json file
def add_bank_account(file_path, account_name):
    with open(file_path, "r") as f:
        data = json.load(f)

    if data is None or "Accounts" not in data:
        data = {"Accounts": {}}

    if not isinstance(data["Accounts"], dict):
        return "Error: Accounts must be a dictionary"

    if account_name not in data["Accounts"]:
        data["Accounts"][account_name] = {}

        write_json_file(file_path, data)

### A basic function to remove a user from the json file
def remove_bank_account(data, name, account_name):
    if name in data and account_name in data[name]:
        del data[name][account_name]

    return data

### A basic function to add data to a user in the json file
def add_data_to_account(file_path, account_name, input_date, input_amount):
    with open(file_path, "r") as f:
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

    write_json_file(file_path, data)

    return "Success"

### Sort the data in the json file
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