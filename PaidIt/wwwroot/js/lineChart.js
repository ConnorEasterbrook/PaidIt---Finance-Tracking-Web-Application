var chart;
let accounts = [];
let previousMonth = 1;

window.onload = function ()
{
    const data = $('#accountsContainer').data('chart');
    InitializeChart(data);
};

$('#accountsContainer').on('click', '.account', function ()
{
    var index = $(this).index() - 1;
    var dataset = chart.data.datasets[index];
    var meta = chart.getDatasetMeta(index);

    // See if this dataset is hidden
    var wasHidden = meta.hidden === null ? dataset.hidden : meta.hidden;

    // Toggle visibility
    dataset.hidden = !wasHidden;
    meta.hidden = !wasHidden;

    if (dataset.hidden) {
        $(this).css('opacity', '0.2'); 
    } else {
        $(this).css('opacity', '1'); 
    }

    // Update chart
    chart.update();
});

function InitializeChart(data) {
    var datasets = [];

    for (var accountName in data.Accounts) {
        // Check if the account has any data
        if (data.Accounts[accountName].Inputs.length === 0) {
            continue;
        }

        // Get the data for the account
        var accountData = data.Accounts[accountName].Inputs;
        var dataPoints = [];

        for (var i = 0; i < accountData.length; i++) {
            var date = new Date(accountData[i].Date);
            var amount = accountData[i].Amount;

            dataPoints.push({ x: date, y: amount });
        }

        var dataset = {
            label: accountName,
            data: dataPoints,
            backgroundColor: data.Accounts[accountName].Colour,
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
    var accountsContainer = $('#accountsContainer');
    for (var accountName in data.Accounts) {
        const accountData = {
            name: accountName,
            label: accountName,
            data: data.Accounts[accountName].Inputs,
            borderColor: "#ffffff",
            backgroundColor: data.Accounts[accountName].Colour,
            fill: true,
        };

        const accountButton = CreateAccountButton(accountData);
        accountsContainer.append(accountButton);
    }

    UpdateData();
}

$('#addAccountBtn').on('click', AddAccount);

function AddAccount()
{
    console.log("AddAccount");
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
            backgroundColor: '#ffffff',
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

        $('#accountsContainer').append(CreateAccountButton(accountData));

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
    const button = $("<span>", {
        id: "account_button " + account.name,
        class: "account",
        text: account.name,
        css: {
            backgroundColor: account.backgroundColor
        }
    });

    button.addClass('secondary_button').addClass('secondary_button--selectable');

    return button;
}

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