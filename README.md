# PaidIt
PaidIt is a financial tracking application that allows you to track your finances in a simple and easy way. The application is built using C#, ASP .NET, Python, and JavaScript. It uses Python to serialise and analyse data on a JSON file, which is then extracted with C# for a JavaScript front end. Conversly, information entered from the JavaScript front end goes through the C# controller for the Python to handle.

## Technologies
List of technologies or frameworks used in the project.
- C#
- ASP .NET
- Python
- JavaScript

## Installation
Steps to install the project:

1. Clone the repository
```
git clone https://github.com/ConnorEasterbrook/PaidIt.git
```

2. Install dependencies if necessary
```
dotnet restore
```

## How to Run
If your IDE is unable to run the project with debug, use the steps below.

Steps to run the project:
1. Run the command
```
dotnet run
```

2. Open the browser and navigate to the localhost mentioned in output.

## Usage
Usage on this project is very simple. Enter information where it asks it to be entered and the program handles the rest. The intended use is to enter bank totals per entry.

## License
This project is licensed under the BSD 3-Clause License - see the LICENSE.md file for details.
