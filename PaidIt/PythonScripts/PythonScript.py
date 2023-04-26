import json
import urllib

### A basic function to read a json file
def read_json_file(file_path):
    with open(file_path) as f:
        data = json.load(f)

        if "Accounts" not in data:
            data = {"Accounts": []}
            write_json_file(file_path, data)

### A basic function to write a json file
def write_json_file(file_path, data):
    with open(file_path, "w") as f:
        json.dump(data, f)

### A basic function to retrieve the data from the json file
def get_data_from_json(file_path):
    data = read_json_file(file_path)

    json_data = json.dumps(data)

    url = "Home/ChartData"
    headers = {"Content-Type": "application/json"}
    req = urllib.Request(url, json_data, headers)
    response = urllib.urlopen(req)

### A basic function to add a new user to the json file
def add_bank_account(file_path, account_name):
    with open(file_path, "r") as f:
        data = json.load(f)
    
        if account_name not in data["Accounts"]:
            data["Accounts"] = {account_name: {}}
            write_json_file(file_path, data)

### A basic function to remove a user from the json file
def remove_bank_account(data, name, account_name):
    if name in data and account_name in data[name]:
        del data[name][account_name]

    return data

### A basic function to add data to a user in the json file
def add_data_to_account(filename, account_name, input_date, input_amount):
    data = read_json_file(filename)

    if not data["Accounts"]:
        return "No accounts found"

    account = data["Accounts"][0]

    if account_name not in account:
        return "Account does not exist"

    if "Inputs" not in account[account_name]:
        account[account_name]["Inputs"] = []

    if input_amount < 0:
        return "Input amount must be positive"

    account[account_name]["Inputs"].append(
        {
            "Date": input_date,
            "Amount": input_amount
        })

    write_json_file(filename, data)

    return "Data added successfully"