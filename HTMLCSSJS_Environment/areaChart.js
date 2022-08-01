new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
        labels: ['June', 'July', 'August'],
        datasets: [{
            data: [100, 200, 500],
            label: "Account A",
            borderColor: "#81b6cc",
            backgroundColor: "#81b6cc",
            fill: true
        }, {
            data: [200, 400, 100],
            label: "Account B",
            borderColor: "#81cc9e",
            backgroundColor: "#81cc9e",
            fill: true
        }, {
            data: [300, 200, 100],
            label: "Account C",
            borderColor: "#9081cc",
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
                stacked: true,
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    }
});

