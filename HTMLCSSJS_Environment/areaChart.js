new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
        labels: ['June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            data: [100, 200, 500, 200, 100, 300, 400],
            label: "Account A",
            borderColor: "#6b6b6b",
            backgroundColor: "#81b6cc",
            fill: true
        }, {
            data: [200, 400, 100, 200, 300, 400, 100],
            label: "Account B",
            borderColor: "#6b6b6b",
            backgroundColor: "#81cc9e",
            fill: true
        }, {
            data: [300, 200, 100, 200, 300, 100, 500],
            label: "Account C",
            borderColor: "#cccccc",
            backgroundColor: "#9081cc",
            fill: true
        }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index'
            },
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
                    text: 'Month'
                }
            },
            y: {
                beginAtZero: true,
                stacked: true,
                title: {
                    display: true,
                    text: 'Total Money'
                },
                ticks: {
                    callback: function (value, index, values) {
                        return '£' + value;
                    }
                }
            }
        }
    }
});

