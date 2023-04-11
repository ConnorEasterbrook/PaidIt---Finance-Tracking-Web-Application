import json
import os

### A basic function to read a json file
def read_json_file(file_path):
    with open(file_path) as f:
        data = json.load(f)
    return data

### A basic function to write a json file
def write_json_file(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f)

### A basic function to create a json file
def create_json_file(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f)

### A basic function to add a new user to the json file
def add_bank_account(data, name, account_name):
    if name not in data:
        data[name] = {}
    data[name][account_name] = []
    return data

### A basic function to remove a user from the json file
def remove_bank_account(data, name, account_name):
    if name in data and account_name in data[name]:
        del data[name][account_name]
    return data

### A basic function to add data to a user in the json file
def add_data_to_account(data, name, account_name, date, amount):
    if name in data and account_name in data[name]:
        data[name][account_name].append({"date": date, "amount": amount})
    return data

