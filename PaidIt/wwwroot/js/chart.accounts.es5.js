'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var chart;
var accounts = [];
var previousMonth = 1;

window.onload = function () {
    var data = $('#accountsContainer').data('chart');
    InitializeChart(data);
};

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
            fill: true
        };

        datasets.push(dataset);
    }

    chart = new Chart(document.getElementById("myChart"), {
        type: 'line',
        data: {
            labels: [],
            datasets: datasets
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
                            size: 20
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
                        callback: function callback(value, index, values) {
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
        var _accountData = {
            name: accountName,
            label: accountName,
            data: data.Accounts[accountName].Inputs,
            borderColor: "#ffffff",
            backgroundColor: data.Accounts[accountName].Colour,
            fill: true
        };

        var accountButton = CreateAccountButton(_accountData);
        accountsContainer.append(accountButton);
    }

    UpdateData();
}

$('#addAccountBtn').on('click', AddAccount);

function AddAccount() {
    console.log("AddAccount");
    var accountName = prompt("Enter the name of the account:");
    if (accountName) {
        // Check if the account already exists
        if (accounts[accountName]) {
            alert("An account with that name already exists.");
            return;
        }

        var accountData = {
            name: accountName,
            label: accountName,
            backgroundColor: '#ffffff',
            data: [],
            borderColor: "#6b6b6b",
            fill: true
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
            url: "/Home/AddNewAccountAjax",
            type: "POST",
            data: { accountName: accountName },
            success: function success(result) {
                alert("Success");
            },
            error: function error(xhr, textStatus, errorThrown) {
                alert("An error occurred while calling the C# function.");
            }
        });
    }
}

function CreateAccountButton(account) {
    var button = $("<span>", {
        id: "account_button-" + account.name,
        'class': "account_button",
        text: account.name,
        css: {
            backgroundColor: account.backgroundColor
        }
    });

    button.addClass('secondary_button').addClass('secondary_button--selectable');

    return button;
}

function UpdateData() {
    var months = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    if (previousMonth === months) {
        return;
    }
    previousMonth = months;

    // Calculate the earliest and latest dates in the datasets
    var startDate = new Date(Math.min.apply(Math, _toConsumableArray(chart.data.datasets.flatMap(function (dataset) {
        return dataset.data.map(function (data) {
            return new Date(data.x).getTime();
        });
    }))));
    var endDate = new Date(Math.max.apply(Math, _toConsumableArray(chart.data.datasets.flatMap(function (dataset) {
        return dataset.data.map(function (data) {
            return new Date(data.x).getTime();
        });
    }))));

    // Update the labels on the x-axis based on the selected time span
    chart.data.labels = GetMonthLabels(startDate, endDate);

    // Fill in any missing data points
    chart.data.datasets.forEach(function (dataset) {
        var newData = [];

        chart.data.labels.forEach(function (label) {
            // Try to find an existing data point
            var dataPoint = dataset.data.find(function (data) {
                return new Date(data.x).toLocaleString('default', { month: 'long', year: 'numeric' }) === label;
            });
            var x = new Date(label);
            var y = dataPoint ? dataPoint.y : newData.length > 0 ? newData[newData.length - 1].y : 0;

            newData.push({ x: x, y: y });
        });

        dataset.data = newData;
    });

    // Update the chart
    chart.update();
}

function GetMonthLabels(startDate, endDate) {
    var labels = [];

    for (var d = startDate; d <= endDate; d.setMonth(d.getMonth() + 1)) {
        labels.push(d.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }

    return labels;
}

$(document).on('click', '.account_button', accountButtonClicked);
$('#editAccountBtn').on('click', editAccount);

function accountButtonClicked() {
    var index = $(this).index();

    if (index >= chart.data.datasets.length) {
        return;
    }

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
}

function editAccount() {
    $('#editAccountCover').removeClass('d-none');
    $('#primaryChart').addClass('d-none');

    // Create a dropdown menu that contains all of the accounts
    var dropdown = $('#editAccountDropdown');
    dropdown.empty();
    for (var accountName in accounts) {
        var option = $('<option>', {
            value: accountName,
            text: accountName
        });
        dropdown.append(option);
    }
}

