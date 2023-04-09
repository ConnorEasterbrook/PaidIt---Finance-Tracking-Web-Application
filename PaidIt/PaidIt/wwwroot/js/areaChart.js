const currency = "GBP";
let chart;

function InitializeChart()
{
    chart = new Chart(document.getElementById("myChart"), {
        type: 'line',
        data: {
            labels: [],
            datasets: []
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
                        callback: function (value, index, values)
                        {
                            if (currency == "USD")
                            {
                                return '$' + value;
                            }
                            else if (currency == "GBP")
                            {
                                return '£' + value;
                            }
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
}

function AddAccount()
{
    const accountName = prompt("Enter the name of the account:");
    if (accountName)
    {
        const accountData = {
            label: accountName,
            data: [],
            borderColor: "#6b6b6b",
            backgroundColor: getRandomColor(),
            fill: true,
        };
        chart.data.datasets.push(accountData);
        chart.update();
    }
}

function AddData()
{
    const accountName = document.getElementById("accountName").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    const accountIndex = accounts.findIndex(account => account.name === accountName);
    if (accountIndex === -1)
    {
        alert(`Account ${accountName} does not exist`);
        return;
    }

    if (isNaN(amount))
    {
        alert("Please enter a valid amount");
        return;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime()))
    {
        alert("Please enter a valid date");
        return;
    }

    const accountData = chart.data.datasets[accountIndex].data;
    const label = chart.data.datasets[accountIndex].label;
    const index = accountData.findIndex(data => data.x === parsedDate);
    if (index !== -1)
    {
        accountData[index].y += amount;
    } else
    {
        accountData.push({ x: parsedDate, y: amount });
    }

    chart.update();
}

function UpdateData(months)
{
    console.log(months);
}
