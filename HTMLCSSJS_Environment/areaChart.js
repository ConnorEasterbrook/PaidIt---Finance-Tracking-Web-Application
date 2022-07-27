new Chart(document.getElementById("myChart"), {
    type: 'line',
    data: {
        labels: [1500, 1600, 1700],
        datasets: [{
            data: [100, 300, 200],
            label: "Africa",
            borderColor: "#3e95cd",
            fill: false
        }, {
            data: [200, 400, 300],
            label: "Asia",
            borderColor: "#8e5ea2",
            fill: false
        }, {
            data: [300, 200, 400],
            label: "Europe",
            borderColor: "#3cba9f",
            fill: false
        }, {
            data: [1000, 500, 500],
            label: "Latin America",
            borderColor: "#e8c3b9",
            fill: false
        }, {
            data: [500, 100, 100],
            label: "North America",
            borderColor: "#c45850",
            fill: false
        }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Line Chart - stacked=true'
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

