var chart;
let accounts = [];

function InitializeChart(data) {
    accounts = data.Accounts;
    var datasets = [];

    for (var accountName in accounts) {
        // Check if the account has any data
        if (accounts[accountName].Inputs.length === 0) {
            continue;
        }

        // Get the data for the account
        var accountData = accounts[accountName].Inputs;
        var dataPoints = [];

        for (var i = 0; i < accountData.length; i++) {
            var date = new Date(accountData[i].Date);
            var amount = accountData[i].Amount;

            dataPoints.push({ x: date, y: amount });
        }

        var dataset = {
            label: accountName,
            data: dataPoints,
            borderColor: "#ffffff",
            backgroundColor: accounts[accountName].Colour,
            fill: true,
        };

        datasets.push(dataset);
    }

    chart = new Chart(document.getElementById("myChart"), {
        type: 'line',
        data: {
            labels: [],
            datasets: datasets,
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index'
                },
                legend: {
                    labels: {
                        font: {
                            size: 20
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        font: {
                            size: 20,
                        },
                        color: 'rgb(209, 209, 209)'
                    }
                },
                y: {
                    beginAtZero: true,
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Total Money',
                        font: {
                            size: 20
                        }
                    },
                    ticks: {
                        callback: function (value, index, values) {
                                return '£' + value;
                        },
                        font: {
                            size: 20
                        },
                        color: 'rgb(209, 209, 209)'
                    }
                }
            }
        }
    });

    // Add the accounts to the accounts container
    const accountsContainer = document.getElementById("accountsContainer");
    for (var accountName in accounts) {
        const accountData = {
            name: accountName,
            label: accountName,
            data: accounts[accountName].Inputs,
            borderColor: "#ffffff",
            backgroundColor: accounts[accountName].Colour,
            fill: true,
        };

        const accountButton = CreateAccountButton(accountData);
        accountsContainer.appendChild(accountButton);
    }

    UpdateData();
}

function AddAccount() {
    const accountName = prompt("Enter the name of the account:");
    if (accountName) {
        // Check if the account already exists
        if (accounts[accountName]) {
            alert("An account with that name already exists.");
            return;
        }

        const accountData = {
            name: accountName,
            label: accountName,
            backgroundColor: GetRandomColour(),
            data: [],
            borderColor: "#6b6b6b",
            fill: true,
        };
        chart.data.datasets.push(accountData);
        chart.update();

        // Add new account to the accounts array
        accounts[accountName] = {
            Inputs: []
        };

        const accountsContainer = document.getElementById("accountsContainer");
        const accountButton = CreateAccountButton(accountData);
        accountsContainer.appendChild(accountButton);

        // Make an AJAX request to the SendNewAccount action using jQuery
        $.ajax({
            url: "/Home/SendNewAccount",
            type: "POST",
            data: { accountName: accountName },
            success: function (result) {
                alert("Success");
            },
            error: function (xhr, textStatus, errorThrown) {
                alert("An error occurred while calling the C# function.");
            }
        });
    }
}

function CreateAccountButton(account) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "account";
    button.innerText = account.name;
    button.style.backgroundColor = account.backgroundColor;
    button.onclick = function () {
        // do something when the button is clicked
    };
    return button;
}

function GetRandomColour() {
    const letters = '0123456789ABCDEF';
    let colour = '#';
    for (let i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
}

function AddData() {
    const accountName = document.getElementById("accountName").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    const accountIndex = chart.data.datasets.findIndex(dataset => dataset.label === accountName);
    if (accountIndex === -1) {
        alert(`Account ${accountName} does not exist`);
        return;
    }

    if (isNaN(amount)) {
        alert("Please enter a valid amount");
        return;
    }

    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
        alert("Please enter a valid date");
        return;
    }

    const accountData = chart.data.datasets[accountIndex].data;
    const index = accountData.findIndex(data => data.x === parsedDate);
    if (index !== -1) {
        accountData[index].y += amount;
    } else {
        accountData.push({ x: parsedDate, y: amount });
    }

    console.log(accountName, amount, date);

    // Make an AJAX request to the SendNewData action using jQuery
    $.ajax({
        url: "/Home/SendNewData",
        type: "POST",
        data: { accountName: accountName, date: date, amount: amount },
        success: function (result) {
            alert("Success");
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("An error occurred while calling the C# function.");
        }
    });

    chart.update();
}

let previousMonth = 1;

function UpdateData(months = 0) {
    if (previousMonth === months) {
        return;
    }
    previousMonth = months;

    // Calculate the earliest and latest dates in the datasets
    let startDate = new Date(Math.min(...chart.data.datasets.flatMap((dataset) => dataset.data.map((data) => new Date(data.x).getTime()))));
    let endDate = new Date(Math.max(...chart.data.datasets.flatMap((dataset) => dataset.data.map((data) => new Date(data.x).getTime()))));


    // Update the labels on the x-axis based on the selected time span
    chart.data.labels = GetMonthLabels(startDate, endDate);

    // Fill in any missing data points
    chart.data.datasets.forEach((dataset) => {
        const newData = [];

        chart.data.labels.forEach((label) => {
            // Try to find an existing data point
            const dataPoint = dataset.data.find((data) => new Date(data.x).toLocaleString('default', { month: 'long', year: 'numeric' }) === label);
            const x = new Date(label);
            const y = dataPoint ? dataPoint.y : (newData.length > 0 ? newData[newData.length - 1].y : 0);

            newData.push({ x, y });
        });

        dataset.data = newData;
    });

    // Update the chart
    chart.update();
}

function GetMonthLabels(startDate, endDate) {
    const labels = [];

    for (let d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
        labels.push(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }

    return labels;
}