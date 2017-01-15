// n - порядковый номер элемента. общий для всех
// (n)Rx - резистор постоянный
// (n)Cx - конденсатор постоянной емкости
// (n)Dx - диод
// kondencator1 - Конд постоянной емкости
// kondencator2 - Конд электролитический поляризованный
// kondencator3 - Конд электролитический неполяризованный
// kondencator4 - Конд переменной емкости

var LINECOUNT = 0;
var masGraph = [];
var NETLIST = "";

function SearchElemForSetting()
{
    var list = "";
    var device = new Array(document.getElementsByClassName('R1'), document.getElementsByClassName('D1'), document.getElementsByClassName('C1'), document.getElementsByClassName('V1'), document.getElementsByClassName('C2'));

    for (i = 0; i < device.length; i++)
    {
        if (device[i] != undefined)
        {
            if (device[i][0] != undefined)
            {
                for (j = 0; j < device[i].length; j++)
                {
                    if (device[i][j] != undefined)
                    {
                        list = list + device[i][j].getAttribute("spiceName") + " ";
                    }

                }
            }
        }
    }
    // console.log(list);
    return list;
}

function SearchElemPoints()
{
    var list = "";
    var device = new Array(document.getElementsByClassName('Lpoint'));

    for (i = 0; i < device.length; i++)
    {
        if (device[i] != undefined)
        {
            if (device[i][0] != undefined)
            {
                for (j = 0; j < device[i].length; j++)
                {
                    if (device[i][j] != undefined)
                    {
                        list = list + device[i][j].getAttribute("name") + " ";
                    }

                }
            }
        }
    }

    return list;
}


function SearchElem(paramAnalis)
{
    var list = "";
    var line = document.getElementsByClassName('line');
    var device = new Array(document.getElementsByClassName('R1'), document.getElementsByClassName('D1'), document.getElementsByClassName('C1'), document.getElementsByClassName('V1'), document.getElementsByClassName('C2'));

    for (i = 0; i < device.length; i++)
    {
        if (device[i] != undefined)
        {
            if (device[i][0] != undefined)
            {
                for (j = 0; j < device[i].length; j++)
                {
                    if (device[i][j] != undefined)
                    {
                        list = list + "\n" + device[i][0].getAttribute("spiceName");
                        id = device[i][j].getAttribute("id");
                        var firstPoint = "";
                        var secondPoint = "";
                        for (k = 0; k < line.length; k++)
                        {
                            if (line[k] != undefined)
                            {
                                idK = line[k].getAttribute("id");
                                if (line[k].getAttribute("begin").substring(0, line[k].getAttribute("begin").length - 3) == id || line[k].getAttribute("end").substring(0, line[k].getAttribute("end").length - 3) == id)
                                {
                                    if (((line[k].getAttribute("begin").substring(0, line[k].getAttribute("begin").length - 3) == id) && (line[k].getAttribute("begin").substring(line[k].getAttribute("begin").length - 3, line[k].getAttribute("begin").length) == "228") || (line[k].getAttribute("end").substring(0, line[k].getAttribute("end").length - 3) == id ) && line[k].getAttribute("end").substring(line[k].getAttribute("end").length - 3, line[k].getAttribute("end").length) == "228"))
                                    {
                                        firstPoint = line[k].getAttribute("namePoint");
                                    }

                                    if (((line[k].getAttribute("begin").substring(0, line[k].getAttribute("begin").length - 3) == id) && (line[k].getAttribute("begin").substring(line[k].getAttribute("begin").length - 3, line[k].getAttribute("begin").length) == "229") || (line[k].getAttribute("end").substring(0, line[k].getAttribute("end").length - 3) == id ) && line[k].getAttribute("end").substring(line[k].getAttribute("end").length - 3, line[k].getAttribute("end").length) == "229"))
                                    {
                                        secondPoint = line[k].getAttribute("namePoint");
                                        // secondPoint = document.getElementById(idK).getAttribute("namePoint");
                                    }
                                }
                            }
                        }
                        if (firstPoint != "")
                            list = list + " " + firstPoint;
                        if (secondPoint != "")
                            list = list + " " + secondPoint;
                        firstPoint = "";
                        secondPoint = "";
                        if (device[i][0].getAttribute("class") == "R1") // параметры элемента
                            list = list + " " + device[i][0].getAttribute("om") + "k";
                        if (device[i][0].getAttribute("class") == "V1") // параметры элемента
                            list = list + " dc " + device[i][0].getAttribute("Volt");
                        if (device[i][0].getAttribute("class") == "D1") // параметры элемента
                            list = list + " D1N3491";
                    }

                }
            }
        }
    }
    BV = document.getElementById("BVD1").value;
    CJO = document.getElementById("CJOD1").value;
    FC = document.getElementById("FCD1").value;
    IBV = document.getElementById("IBVD1").value;
    IS = document.getElementById("ISD1").value;
    M = document.getElementById("MD1").value;
    N = document.getElementById("ND1").value;
    RS = document.getElementById("RSD1").value;
    TT = document.getElementById("TTD1").value;
    VJ = document.getElementById("VJD1").value;
    list = list + "\n.MODEL D1N3491 D (BV="+BV+ " CJO="+CJO+" FC="+FC+" IBV="+IBV+" IS="+IS+" M="+M+" N="+N+" RS="+RS+" TT="+TT+" VJ="+VJ+")\n" + paramAnalis + ".end";
    return list;
}

function SendNetlist()
{
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        method: "POST",
        url: "http://media.ls.urfu.ru:8002/analyse/",
        data: {netlist: NETLIST, csrfmiddlewaretoken: csrftoken}
    })
        .done(function (response)
        {
            if (response.status == 'success')
            {
                var result = document.createElement('p');
                for (var i = 0; i < response.stdout.length; i++)
                {
                    result.innerHTML += response.stdout[i];
                    result.innerHTML += '<br />';
                }
                console.log("RESULT    " + result);
            }
            else
            {
                var listData;
                var stop = false;
                listData = JSON.parse(response).stdout;
                masGraph = new Array;
                for (i = 0; i < listData.length; i++)
                {
                    if (listData[i].toString()[0] == "0")
                    {
                        j = i;
                        while (!stop)
                        {
                            masGraph.push(listData[j].toString());
                            if (listData[j].toString() == "")
                            {
                                stop = true;
                                masGraph.pop();
                            }
                            j++;
                        }
                    }
                }
                google.charts.load('current', {'packages': ['corechart']});
                google.charts.setOnLoadCallback(drawChart);
            }
        })
        .fail(function ()
        {
            console.log("E1");
        });

    console.log("NETLIST   \n" + NETLIST);

}

