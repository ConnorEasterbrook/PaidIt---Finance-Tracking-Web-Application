from data_controller import file_exists
from view_controller import build_view, build_error_view

data_path = "userdata.json"
error_code = file_exists(data_path)

if error_code:
    build_error_view(error_code)
else:
    build_view(data_path)
