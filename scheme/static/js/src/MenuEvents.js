var ENTER;
var AnaliseDevice = "";
var Point = "";
var Begin;
var End;
var Step;

function Del()
{
    if (document.getElementById(ElemModal.getAttribute("point")) != null)
        document.getElementById(ElemModal.getAttribute("point")).remove();
    ElemModal.remove();
    if (ElemModal.getAttribute("class") == "Lpoint")
    {

    }
    CloseModal();
    ElemModal = null;
}

function Rotate()
{
    tmp = ElemModal.getAttribute("transform");

    switch (ElemModal.getAttribute("rotate"))
    {
        case  "1":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "2");
            break;

        case  "2":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "3");
            break;

        case  "3":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "4");
            break;

        case  "4":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "1");
            break;

    }

    ElemModal.setAttribute("new", "1");
    lineCorrect(ElemModal);
    CloseModal();
    ElemModal = null;


}

function MouseEnter(e)
{
    if (e.parentNode.parentNode.tagName == "g")
    {
        e.style.stroke = "#000000";
        ENTER = true;
    }
}

function MouseExit(e)
{
    if (e.parentNode.parentNode.tagName == "g" && ENTER)
    {
        e.style.stroke = "#ffffff";
        ENTER = false;
    }
}


function PolyLineCreate(e)
{
    if (CLC == null)
    {
        ENTER = false;
        e.style.stroke = "#000000";

        CLC = e;
        var coords = document.getElementById("svg").getBoundingClientRect();
        var line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        line.setAttribute("id", LINECOUNT.toString() + "l");
        line.setAttribute("class", "line");
        var pos;
        var x;
        var y;
        if (e.getAttribute("class") == "n1")
        {
            pos = e.parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (e.getAttribute("class") == "n2")
        {
            pos = e.parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }

        x = (pos.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        y = (pos.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;

        line.setAttribute("points", x.toString() + "," + y.toString());
        line.setAttribute("lastx", x.toString());
        line.setAttribute("lasty", y.toString());
        line.setAttribute("stroke-width", 5);
        line.oncontextmenu = function ()
        {
            return false;
        }
        line.addEventListener("contextmenu", function (e)
        {
            ElemModal = e.target;
            $('#modalRot')
                .css('display', 'none');
            $('#modalpoint')
                .css('display', 'block');
            OpenModal();
        });
        line.setAttribute("stroke", "black");
        line.setAttribute("fill", "none");
        line.setAttribute("begin", e.id);
        line.setAttribute("end", "");
        line.setAttribute("measureId", "");
        line.setAttribute("namePoint", LINECOUNT.toString());
        LINECOUNT++;
        SVG.appendChild(line);
        CLC = line;
    }
    else
    {
        if (parseInt(CLC.getAttribute("begin")) != e.parentNode.id)
        {
            document.getElementById(CLC.getAttribute("begin")).style.stroke = "#ffffff";
            ENTER = false;
            e.style.stroke = "#ffffff";

            var coords = document.getElementById("svg").getBoundingClientRect();
            var lastx = parseFloat(CLC.getAttribute("lastx"));
            var lasty = parseFloat(CLC.getAttribute("lasty"));
            var pos;
            var x;
            var y;
            if (e.getAttribute("class") == "n1")
            {
                pos = e.parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
            }
            if (e.getAttribute("class") == "n2")
            {
                pos = e.parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
            }

            x = (pos.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
            y = (pos.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;

            AddLine(x, y);
            CLC.setAttribute("end", e.id);
            CLC = null;
            COUNT++;
        }
    }
}


function CloseModal()
{
    $('#modal_form')
        .animate({opacity: 0, top: '45%'}, 200,  // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
            function ()
            { // пoсле aнимaции
                $(this).css('display', 'none'); // делaем ему display: none;
                $('#overlay').fadeOut(400); // скрывaем пoдлoжку
                CUR = null;
            }
        );
}

function OpenModal()
{
    $('#modal_form')
        .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
        .animate({opacity: 1, top: '50%'}, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
}


function createGrid()
{
    for (var i = -750; i < 1500; i = i + 40)
    {
        for (var j = -750; j < 1500; j = j + 40)
        {
            var cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            cir.setAttribute("r", 1);
            cir.setAttribute("cy", i);
            cir.setAttribute("cx", j);
            document.getElementById('GridGroup').appendChild(cir);
        }
    }
}

function TabSubResult(e)
{
    var tabSvg = document.getElementById('tab-svg');
    var menu = document.getElementById('Menu');
    var tabSubResult = document.getElementById('tab-Subresult');
    tabSvg.style.display = "none";
    menu.style.display = "none";
    tabSubResult.style.display = "block";
    var tabResult = document.getElementById('tab-result');
    tabResult.style.display = "none";

    Begin = document.getElementById('SettingsLineBegin').value;
    End = document.getElementById('SettingsLineEnd').value;
    Step = document.getElementById('SettingsLineStep').value;

    switch (e.id)
    {
        case "a1":
            document.getElementById("nameAnalytic").innerHTML = "DC";
            SelectFill();
            SelectPoints();
            param = "";
            if (AnaliseDevice != "Не выбрано" && AnaliseDevice != undefined)
            {
                param = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V";

            }
            if (Point != "Не выбрано" && Point != undefined)
            {
                param += "\n.print dc v(" + Point + ")";
            }
            NETLIST = SearchElem(param);
            // NETLIST = SearchElem(".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n.print dc v(" + Point + ")");
            document.getElementById('ShowNetlist').value = NETLIST;
            document.getElementById('dd').style.background = "#C5C5C5";
            document.getElementById('button-construct').style.background = "#e8e8e8";
            break;
        case "a2":
            document.getElementById("nameAnalytic").innerHTML = "AC";
            NETLIST = SearchElem();
            document.getElementById('dd').style.background = "#C5C5C5";
            document.getElementById('button-construct').style.background = "#e8e8e8";
            break;
        case "a3":
            document.getElementById("nameAnalytic").innerHTML = "Tran";
            NETLIST = SearchElem();
            document.getElementById('dd').style.background = "#C5C5C5";
            document.getElementById('button-construct').style.background = "#e8e8e8";
            break;
    }
}

function TabResultClick(e)
{
    var tabSvg = document.getElementById('tab-svg');
    var tabSubResult = document.getElementById('tab-Subresult');
    var menu = document.getElementById('Menu');
    var tabResult = document.getElementById('tab-result');
    tabSvg.style.display = "none";
    tabSubResult.style.display = "none";
    menu.style.display = "none";
    tabResult.style.display = "block";
    document.getElementById('button-construct').style.background = "#e8e8e8";
    document.getElementById('dd').style.background = "#e8e8e8";
    document.getElementById('button-chart').style.background = "#C5C5C5";
    NETLIST = document.getElementById('ShowNetlist').value;
    SendNetlist();
}

function TabConstructClick(e)
{
    var tabSvg = document.getElementById('tab-svg');
    var menu = document.getElementById('Menu');
    var tabResult = document.getElementById('tab-result');
    var tabSubResult = document.getElementById('tab-Subresult');
    tabSubResult.style.display = "none";
    tabSvg.style.display = "block";
    menu.style.display = "block";
    tabResult.style.display = "none";
    document.getElementById('button-construct').style.background = "#C5C5C5";
    document.getElementById('dd').style.background = "#e8e8e8";
    // document.getElementById("nameAnalytic").innerHTML = "Расчет результатов";
    document.getElementById('button-chart').style.background = "#e8e8e8";
}


function Settings()
{
    if (CUR.getAttribute("class") == "Lpoint")
    {
        document.getElementById("valuesPoint").style.display = "block";
        document.getElementById("valuesR1").style.display = "none";
        document.getElementById("values0").style.display = "none";
        document.getElementById("valuesC1").style.display = "none";
        document.getElementById("valuesC2").style.display = "none";
        document.getElementById("valuesD1").style.display = "none";
        document.getElementById("valuesV1").style.display = "none";
        document.getElementById("propNamePoint").value = CUR.getAttribute("name");
        this.e = CUR;
    }
    if (CUR.getAttribute("class") == "R1")
    {
        document.getElementById("valuesR1").style.display = "block";
        document.getElementById("R1om").value = CUR.getAttribute("om");
        document.getElementById("propNameR1").value = CUR.getAttribute("spiceName");


        document.getElementById("values0").style.display = "none";
        document.getElementById("valuesPoint").style.display = "none";
        document.getElementById("valuesC1").style.display = "none";
        document.getElementById("valuesC2").style.display = "none";
        document.getElementById("valuesD1").style.display = "none";
        document.getElementById("valuesV1").style.display = "none";
        this.e = CUR;

    }
    if (CUR.getAttribute("class") == "C1")
    {
        document.getElementById("valuesC1").style.display = "block";
        document.getElementById("values0").style.display = "none";
        document.getElementById("valuesR1").style.display = "none";
        document.getElementById("valuesPoint").style.display = "none";
        document.getElementById("valuesD1").style.display = "none";
        document.getElementById("valuesC2").style.display = "none";
        document.getElementById("valuesV1").style.display = "none";
        // document.getElementById("propNameC1").value = CUR.getAttribute("spiceName");
        this.e = CUR;
    }
    if (CUR.getAttribute("class") == "D1")
    {
        document.getElementById("valuesD1").style.display = "block";
        document.getElementById("values0").style.display = "none";
        document.getElementById("valuesR1").style.display = "none";
        document.getElementById("valuesC1").style.display = "none";
        document.getElementById("valuesC2").style.display = "none";
        document.getElementById("valuesV1").style.display = "none";
        document.getElementById("valuesPoint").style.display = "none";
        // document.getElementById("propNameD1").value = CUR.getAttribute("spiceName");
        this.e = CUR;
    }
    if (CUR.getAttribute("class") == "C2")
    {
        document.getElementById("valuesC2").style.display = "block";
        document.getElementById("values0").style.display = "none";
        document.getElementById("valuesC1").style.display = "none";
        document.getElementById("valuesD1").style.display = "none";
        document.getElementById("valuesR1").style.display = "none";
        document.getElementById("valuesV1").style.display = "none";
        document.getElementById("valuesPoint").style.display = "none";
        document.getElementById("propNameC2").value = CUR.getAttribute("spiceName");
        document.getElementById("V1V").value = CUR.getAttribute("Volt");
        this.e = CUR;
    }

    if (CUR.getAttribute("class") == "V1")
    {
        document.getElementById("valuesV1").style.display = "block";
        document.getElementById("values0").style.display = "none";
        document.getElementById("valuesC2").style.display = "none";
        document.getElementById("valuesC1").style.display = "none";
        document.getElementById("valuesD1").style.display = "none";
        document.getElementById("valuesR1").style.display = "none";
        document.getElementById("valuesPoint").style.display = "none";
        document.getElementById("propNameV1").value = CUR.getAttribute("spiceName");
        this.e = CUR;
    }
}

function SelectFill()
{

    var list = SearchElemForSetting().split(" ");
    var sum = "<option onclick='OptionClick(this)'>" + "Не выбрано" + "</option>";
    for (i = 0; i < list.length - 1; i++)
    {
        if (list[i] != "")
        {
            sum += "<option onclick='OptionClick(this)'>" + list[i] + "</option>";
        }

    }
    // if (list[0] != "")
    // {
    //     AnaliseDevice = list[0];
    // }
    AnaliseDevice = "Не выбрано";
    $("#PriborList").empty();
    $("#PriborList").append(sum);
}

function SelectPoints()
{

    var list = SearchElemPoints().split(" ");
    var sum = "<option onclick='OptionClickPoint(this)'>" + "Не выбрано" + "</option>";
    for (i = 0; i < list.length - 1; i++)
    {
        if (list[i] != "")
            sum += "<option onclick='OptionClickPoint(this)'>" + list[i] + "</option>";
    }
    // if (list[0] != "")
    // {
    //     Point = list[0];
    // }
    Point = "Не выбрано";
    $("#PointList").empty();
    $("#PointList").append(sum);
}

function OptionClick(e)
{
    var pointSetting = "";
    var deviceSetting = "";
    if (e.innerHTML == "Не выбрано")
    {
        AnaliseDevice = "Не выбрано";
    }
    else
    {
        if (document.getElementsByName(e.innerHTML) != null)
        {
            AnaliseDevice = $("[spiceName = " + e.innerHTML + "]")[0].getAttribute("spiceName");
        }
        else
        {
            AnaliseDevice = e.innerHTML;

        }
    }

    if (Point != "Не выбрано")
    {
        pointSetting = ".print dc v(" + Point + ")\n";
    }
    if (AnaliseDevice != "Не выбрано")
    {
        if (pointSetting != "Не выбрано")
        {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n";
        }
        else
        {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V";
        }
    }
    NETLIST = SearchElem(deviceSetting + pointSetting);

    // NETLIST = SearchElem(".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n.print dc v(" + Point + ")");
    document.getElementById('ShowNetlist').value = NETLIST;
}

function OptionClickPoint(e)
{
    var pointSetting = "";
    var deviceSetting = "";
    if (e.innerHTML == "Не выбрано")
    {
        Point = "Не выбрано";
    }
    else
    {
        if (document.getElementsByName(e.innerHTML) != null)
        {
            Point = $("[name = " + e.innerHTML + "]")[0].getAttribute("lineParent");
            Point = document.getElementById(Point.toString() + "l").getAttribute("namePoint");
        }
        else
        {
            Point = e.innerHTML;
        }
    }
    if (Point != "Не выбрано")
    {
        pointSetting = ".print dc v(" + Point + ")\n";
    }
    if (AnaliseDevice != "Не выбрано")
    {
        if (pointSetting != "Не выбрано")
        {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n";
        }
        else
        {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V";
        }
    }
    NETLIST = SearchElem(deviceSetting + pointSetting);

    // NETLIST = SearchElem(".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n.print dc v(" + Point + ")");
    document.getElementById('ShowNetlist').value = NETLIST;
}

function InputChange()
{
    Begin = document.getElementById('SettingsLineBegin').value;
    End = document.getElementById('SettingsLineEnd').value;
    Step = document.getElementById('SettingsLineStep').value;
    NETLIST = SearchElem(".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n.print dc v(" + Point + ")");
    document.getElementById('ShowNetlist').value = NETLIST;
    console.log(NETLIST);
}

function PropChange()
{
    // this.e;
    // if (this.e.getElementsByTagName("text")[0] != undefined)
    //     this.e.getElementsByTagName("text")[0].innerHTML = document.getElementById("propName").value;
    if (this.e.getAttribute("class") == "R1")
    {
        this.e.getElementsByTagName("text")[0].innerHTML = document.getElementById("propNameR1").value;
        this.e.setAttribute("om", document.getElementById("R1om").value);
        this.e.setAttribute("spiceName", document.getElementById("propNameR1").value);
    }
    if (this.e.getAttribute("class") == "V1")
    {
        this.e.setAttribute("Volt", document.getElementById("V1V").value);
        this.e.getElementsByTagName("text")[0].innerHTML = document.getElementById("propNameV1").value;
        this.e.setAttribute("spiceName", document.getElementById("propNameV1").value);
    }
    if (this.e.getAttribute("class") == "Lpoint")
    {
        this.e.setAttribute("name", document.getElementById("propNamePoint").value);
        document.getElementById(this.e.getAttribute("lineParent") + "l").setAttribute("namePoint", document.getElementById("propNamePoint").value);
    }
}

function CreateMeasurePoint()
{
    var id = ElemModal.getAttribute("id").toString().split("l")[0];
    var elem = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    elem.setAttribute("id", id + "p");
    elem.setAttribute("r", "8");
    elem.setAttribute("cy", ElemModal.getAttribute("points").split(" ")[1].split(",")[1]);
    elem.setAttribute("cx", ElemModal.getAttribute("points").split(" ")[1].split(",")[0]);
    ElemModal.setAttribute("point", id + "p");
    elem.setAttribute("class", "Lpoint");
    elem.setAttribute("name", id);
    elem.setAttribute("lineParent", id);
    elem.addEventListener("mousedown", function (e)
    {
        if (e.which == 1)
        {
            CUR = e.target;
            Settings();
        }
        e.ondragstart = function ()
        {
            return false;
        };
    });
    SVG.appendChild(elem);
    CloseModal();
}

function PointCorrect(e)
{
    point = document.getElementById(e.getAttribute("point"));
    point.setAttribute("cy", e.getAttribute("points").split(" ")[1].split(",")[1]);
    point.setAttribute("cx", e.getAttribute("points").split(" ")[1].split(",")[0]);
}

function CololElem()
{

}
