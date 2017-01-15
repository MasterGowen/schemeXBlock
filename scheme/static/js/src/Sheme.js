var chart;

var lastSelect = [2];
function drawChart()
{

    var point = false;
    var data2 = [['V', 'I']];

    document.getElementById("t1").value = "";
    document.getElementById("t2").value = "";

    for (i = 0; i < masGraph.length; i++)
    {
        data2[i + 1] = [Number(masGraph[i].toString().split("\t")[1]), Number(masGraph[i].toString().split("\t")[2])];
        // console.log(Number(masGraph[i].toString().split("\t")[1]), Number(masGraph[i].toString().split("\t")[2]) + "\n")
    }

    var data = google.visualization.arrayToDataTable(data2);

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Day');
    data.addColumn('number', 'Guardians of the Galaxy');
    data.addColumn('number', 'The Avengers');
    data.addColumn('number', 'Transformers: Age of Extinction');

    data.addRows([
        [1, 37.8, 80.8, 41.8],
        [2, 30.9, 69.5, 32.4],
        [3, 25.4, 57, 25.7],
        [4, 11.7, 18.8, 10.5],
        [5, 11.9, 17.6, 10.4],
        [6, 8.8, 13.6, 7.7],
        [7, 7.6, 12.3, 9.6],
        [8, 12.3, 29.2, 10.6],
        [9, 16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11, 5.3, 7.9, 4.7],
        [12, 6.6, 8.4, 5.2],
        [13, 4.8, 6.3, 3.6],
        [14, 4.2, 6.2, 3.4]
    ]);

    var options = {
        title: 'График',
        curveType: 'function',
        width: 818,
        height: 500,
        // hAxis: {
        //     format: 'scientific'
        // },
        // VAxis: {
        //     format: 'scientific'
        // },
        chartArea: {
            width: 640,
            height: 450
        },
        animation: {
            startup: true,
            duration: 1000,
            easing: 'inAndOut'
        },
        explorer: {
            actions: ['dragToZoom', 'rightClickToReset'],
            maxZoomIn: 0.1
        },
        // selectionMode: 'multiple',
        // aggregationTarget: 'auto',

    };

    function clickChart()
    {
        var selectedItem = chart.getSelection();
        if (selectedItem.length > 0)
        {
            if (lastSelect.length >= 2)
            {
                lastSelect.shift();
            }

            lastSelect.push({
                row: selectedItem[selectedItem.length - 1].row,
                column: selectedItem[selectedItem.length - 1].column
            });
            chart.setSelection(lastSelect);

            if (typeof lastSelect[0] == "object")
            {
                document.getElementById("t1").value = data.getValue(lastSelect[0].row, 0) + ";" + data.getValue(lastSelect[0].row, lastSelect[0].column);
                document.getElementById("t2").value = data.getValue(lastSelect[1].row, 0) + ";" + data.getValue(lastSelect[1].row, lastSelect[1].column);
            }
            else
            {
                document.getElementById("t1").value = data.getValue(lastSelect[1].row, 0) + ";" + data.getValue(lastSelect[1].row, lastSelect[1].column);
            }
        }
    }


    chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    google.visualization.events.addListener(chart, 'select', clickChart);


    chart.draw(data, options);
}

function clear()
{

}