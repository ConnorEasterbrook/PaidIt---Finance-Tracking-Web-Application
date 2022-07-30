new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
        labels: ['June', 'July', 'August'],
        datasets: [{
            data: [100, 300, 200],
            label: "Africa",
            borderColor: "#81b6cc",
            backgroundColor: "#81b6cc",
            fill: true
        }, {
            data: [200, 400, 300],
            label: "Asia",
            borderColor: "#81cc9e",
            backgroundColor: "#81cc9e",
            fill: true
        }, {
            data: [300, 200, 400],
            label: "Europe",
            borderColor: "#9081cc",
            backgroundColor: "#9081cc",
            fill: true
        }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Financial Chart'
            },
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

