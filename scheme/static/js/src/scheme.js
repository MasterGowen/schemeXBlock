/* Javascript for SchemeXBlock. */
var spiceHandler;

function SchemeXBlock(runtime, element) {
    spiceHandler = runtime.handlerUrl(element, 'spice_handler');
}

$(function($) {

    var CUR = null; //нажатый элемент
    var COUNT = 0; // ID элементов
    var R1 = 1;
    var C1 = 1;
    var D1 = 1;
    var V1 = 1;
    var CLC = null; // для соединения точками
    var ElemModal = null;
    var SVG;
    var NEWELEM = null;
    var SHIFT = 0;

    SVG = document.getElementById('svggroup');
    document.getElementById('m1').addEventListener("click", function() {
        NEWELEM = "R1";
    });
    document.getElementById('m2').addEventListener("click", function() {
        NEWELEM = "C1";
    });
    document.getElementById('m3').addEventListener("click", function() {
        NEWELEM = "C2";
    });
    document.getElementById('m4').addEventListener("click", function() {
        NEWELEM = "V1";
    });
    document.getElementById('m5').addEventListener("click", function() {
        NEWELEM = "D1";
    });
    document.getElementById('button-construct').style.background = "#C5C5C5";
    document.getElementById("svg").oncontextmenu = function() {
        return false;
    }
    createGrid();

    $('#modal_close, #overlay').click(function() {
        CloseModal();
    });
    document.getElementById("SettingsLineBegin").value = "";

    document.getElementById("valuesR1").style.display = "none";
    document.getElementById("valuesPoint").style.display = "none";
    document.getElementById("valuesC1").style.display = "none";
    document.getElementById("valuesC2").style.display = "none";
    document.getElementById("valuesD1").style.display = "none";
    document.getElementById("valuesV1").style.display = "none";

    document.getElementById("SettingsLineBegin").value = 0;
    document.getElementById("SettingsLineEnd").value = 2;
    document.getElementById("SettingsLineStep").value = 0.01;
    document.getElementById("R1om").value = 0.1;
    document.getElementById("V1V").value = 2;



    $(document).keydown(function(e) {
        if (e.keyCode === 27) {
            if (CLC) {
                document.getElementById(CLC.getAttribute("begin")).style.stroke = "#ffffff";
                CLC.remove();
                ENTER = false;
                CLC = null;
            }
        }
    });

    document.onmousemove = function(e) {
        if (NEWELEM == "R1") {
            createElem("resistor1", e);
        }

        if (NEWELEM == "C1") {
            createElem("kondencator1", e);
        }

        if (NEWELEM == "C2") {
            createElem("kondencator2", e);
        }

        if (NEWELEM == "V1") {
            createElem("batary", e);
        }

        if (NEWELEM == "D1") {
            createElem("diod1", e);
        }

        if (CUR != null && !ENTER) {
            var coords = document.getElementById("svg").getBoundingClientRect();
            var x = (Number(e.clientX - coords.left) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
            var y = (Number(e.clientY - coords.top) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
            var cx;
            var cy;

            cx = x - parseFloat(CUR.getAttribute('x'));
            cy = parseFloat(CUR.getAttribute('y')) + y;

            CUR.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')');
            tmp = CUR.getAttribute("transform");
            if (CUR.getAttribute("new") != "0") {
                if (parseInt(CUR.getAttribute("rotate")) == "1") {
                    CUR.setAttribute("transform", tmp.toString() + " rotate(0)");
                }
                if (parseInt(CUR.getAttribute("rotate")) == "2") {
                    CUR.setAttribute("transform", tmp.toString() + " rotate(90)");
                }
                if (parseInt(CUR.getAttribute("rotate")) == "3") {
                    CUR.setAttribute("transform", tmp.toString() + " rotate(180)");
                }
                if (parseInt(CUR.getAttribute("rotate")) == "4") {
                    CUR.setAttribute("transform", tmp.toString() + " rotate(270)");
                }
            } else {
                CUR.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')');
            }


            lineCorrect(CUR);
            CLC = null;
        }
    };

    document.onmouseup = function(e) {
        if (e.which == 1) {
            if (CUR != null) {
                var x = parseInt(CUR.getAttribute("x"));
                var y = parseInt(CUR.getAttribute("y"));
                if (x % 40 != 0) {
                    x = x + x % 40;
                }
                if (y % 40 != 0) {
                    y = y + y % 40;
                }
                CUR.setAttribute("x", x);
                CUR.setAttribute("y", y);
            }
        }
        CUR = null;
    };
});

function lineCorrect(link) {
    if (!CLC) {
        var coords = document.getElementById("svg").getBoundingClientRect();
        if (link.getElementsByTagName("circle")[0].getAttribute("class") == "n1") {
            pos = link.getElementsByTagName("circle")[0].parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (link.getElementsByTagName("circle")[0].getAttribute("class") == "n2") {
            pos = link.getElementsByTagName("circle")[0].parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }
        if (link.getElementsByTagName("circle")[1].getAttribute("class") == "n1") {
            pos1 = link.getElementsByTagName("circle")[1].parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (link.getElementsByTagName("circle")[1].getAttribute("class") == "n2") {
            pos1 = link.getElementsByTagName("circle")[1].parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }
        x = (pos.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        y = (pos.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;

        x1 = (pos1.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        y1 = (pos1.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;


        for (var i = 0; i < SVG.children.length; i++) {
            if (SVG.children[i].getAttribute("begin")) {
                if (SVG.children[i].getAttribute("begin") == link.getElementsByClassName("n1")[0].id.toString()) {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[1];
                    points = "";
                    for (j = 2; j < length; j++) {
                        if (j != length - 1)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }
                    if ((Math.abs(x - lastx)) < (Math.abs(y - lasty))) {
                        SVG.children[i].setAttribute("points", x.toString() + "," + y.toString() + " " + lastx.toString() + "," + y.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    } else {
                        SVG.children[i].setAttribute("points", x.toString() + "," + y.toString() + " " + x.toString() + "," + lasty.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }
                if (SVG.children[i].getAttribute("begin") == link.getElementsByClassName("n2")[0].id.toString()) {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[1];
                    points = "";
                    for (j = 2; j < length; j++) {
                        if (j != length - 1)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }
                    if ((Math.abs(x1 - lastx)) < (Math.abs(y1 - lasty))) {
                        SVG.children[i].setAttribute("points", x1.toString() + "," + y1.toString() + " " + lastx.toString() + "," + y1.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    } else {
                        SVG.children[i].setAttribute("points", x1.toString() + "," + y1.toString() + " " + x1.toString() + "," + lasty.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }
            }
            if (SVG.children[i].getAttribute("end")) {
                if (SVG.children[i].getAttribute("end") == link.getElementsByClassName("n1")[0].id.toString()) {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[1];
                    points = "";
                    for (j = 0; j < length - 2; j++) {
                        if (j != length - 3)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }
                    if ((Math.abs(x - lastx)) < (Math.abs(y - lasty))) {
                        SVG.children[i].setAttribute("points", points + " " + lastx.toString() + "," + y.toString() + " " + x.toString() + "," + y.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    } else {
                        SVG.children[i].setAttribute("points", points + " " + x.toString() + "," + lasty.toString() + " " + x.toString() + "," + y.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }

                if (SVG.children[i].getAttribute("end") == link.getElementsByClassName("n2")[0].id.toString()) {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[1];
                    points = "";
                    for (j = 0; j < length - 2; j++) {
                        if (j != length - 3)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }

                    if ((Math.abs(x1 - lastx)) < (Math.abs(y1 - lasty))) {
                        SVG.children[i].setAttribute("points", points + " " + lastx.toString() + "," + y1.toString() + " " + x1.toString() + "," + y1.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    } else {
                        SVG.children[i].setAttribute("points", points + " " + x1.toString() + "," + lasty.toString() + " " + x1.toString() + "," + y1.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }
            }
        }
    }
}

function createElem(type, e) {

    var elem = document.getElementById(type.toString()).cloneNode(true);
    switch (type.toString()) {
        case 'resistor1':
            elem.setAttribute("class", "R1");
            elem.setAttribute("id", COUNT);
            elem.setAttribute("spiceName", "R" + R1);
            elem.getElementsByTagName("text")[0].innerHTML = "R" + R1;
            document.getElementById("propNameR1").value = "R" + R1;
            elem.setAttribute("om", "0.1");
            R1++;
            break;
        case 'kondencator1':
            elem.setAttribute("class", "C1");
            elem.setAttribute("id", COUNT);
            elem.getElementsByTagName("text")[0].innerHTML = "C" + C1;
            document.getElementById("propNameR1").value = "C" + C1;
            elem.setAttribute("spiceName", "C" + C1);
            C1++;
            break;
        case 'diod1':
            elem.setAttribute("class", "D1");
            elem.setAttribute("id", COUNT);
            elem.getElementsByTagName("text")[0].innerHTML = "D" + D1;
            document.getElementById("propNameR1").value = "D" + D1;
            elem.setAttribute("spiceName", "D" + D1);
            D1++;
            break;
        case 'kondencator2':
            elem.setAttribute("class", "C2");
            elem.setAttribute("id", COUNT);
            elem.getElementsByTagName("text")[0].innerHTML = "C" + C1;
            document.getElementById("propNameR1").value = "C" + C1;
            elem.setAttribute("spiceName", "C" + C1);
            C1++;
            break;
        case 'batary':
            elem.setAttribute("class", "V1");
            elem.setAttribute("id", COUNT);
            elem.getElementsByTagName("text")[0].innerHTML = "V" + V1;
            document.getElementById("propNameR1").value = "V" + V1;
            elem.setAttribute("spiceName", "V" + V1);
            elem.setAttribute("Volt", "2");
            V1++;
            break;

    }

    elem.setAttribute("y", 0);
    elem.setAttribute("x", 0);
    elem.setAttribute("rotate", "1");
    elem.setAttribute("new", "0");

    elem.getElementsByTagName("circle")[0].setAttribute("id", COUNT.toString() + 228);
    elem.getElementsByTagName("circle")[1].setAttribute("id", COUNT.toString() + 229);
    elem.addEventListener("mousedown", function(e) {
        if (e.which == 1 && !ENTER) {
            CUR = e.target.parentNode;
            Settings();
        }
        e.ondragstart = function() {
            return false;
        };
    });

    elem.oncontextmenu = function() {
        return false;
    }

    elem.addEventListener("contextmenu", function(e) {
        ElemModal = e.target.parentNode;
        $('#modalRot')
            .css('display', 'block');
        $('#modalpoint')
            .css('display', 'none');
        OpenModal();
    });

    SVG.appendChild(elem);
    COUNT = COUNT + 1;
    NEWELEM = null;
    CUR = elem;
}

function scale() {
    size = document.getElementById("size").value;
    SVG.setAttribute("transform", "scale(" + size + " )");
    document.getElementById("scaleText").innerHTML = "Масштаб  " + size.toString();


    switch (size) {
        case '1':
            SHIFT = 0;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '1.1':
            SHIFT = 30;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '1.2':
            SHIFT = 60;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '1.3':
            SHIFT = 90;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '1.4':
            SHIFT = 120;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '1.5':
            SHIFT = 150;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '0.9':
            SHIFT = -30;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '0.8':
            SHIFT = -60;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '0.7':
            SHIFT = -90;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '0.6':
            SHIFT = -120;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
        case '0.5':
            SHIFT = -150;
            document.getElementById('svg').setAttribute("viewBox", SHIFT + " " + SHIFT + " 750 400");
            break;
    }
}


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

document.onmousedown = function(e) {
    if (CLC) {

        var coords = document.getElementById("svg").getBoundingClientRect();
        var x = (Number(e.clientX - coords.left) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
        var y = (Number(e.clientY - coords.top) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
        var begin = document.getElementById(CLC.getAttribute("begin"));
        var pos;

        if (begin.getAttribute("class") == "n1") {
            pos = begin.parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (begin.getAttribute("class") == "n2") {
            pos = begin.parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }

        var bx = (pos.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        var by = (pos.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;

        if ((Math.abs(bx - x) > 20) || (Math.abs(by - y) > 20)) {
            AddLine(x, y);
        }

    }
}

function AddLine(x, y) {

    var lastx = parseFloat(CLC.getAttribute("lastx"));
    var lasty = parseFloat(CLC.getAttribute("lasty"));


    if ((Math.abs(x - lastx)) < (Math.abs(y - lasty))) {

        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + lastx.toString() + "," + y.toString());
        CLC.setAttribute("lastx", lastx.toString());
        CLC.setAttribute("lasty", y);
        lastx = parseFloat(CLC.getAttribute("lastx"));
        lasty = parseFloat(CLC.getAttribute("lasty"));
        if (CLC.getAttribute("firstx") == "") {
            CLC.setAttribute("firstx", lastx);
            CLC.setAttribute("firsty", lasty);
        }
        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + x.toString() + "," + lasty.toString());
        CLC.setAttribute("lastx", x.toString());
        CLC.setAttribute("lasty", lasty.toString());
        if (CLC.getAttribute("secx") == "") {
            CLC.setAttribute("secx", lastx);
            CLC.setAttribute("secy", lasty);
        }
    } else {
        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + x.toString() + "," + lasty.toString());
        CLC.setAttribute("lastx", x.toString());
        CLC.setAttribute("lasty", lasty.toString());
        lastx = parseFloat(CLC.getAttribute("lastx"));
        lasty = parseFloat(CLC.getAttribute("lasty"));
        if (CLC.getAttribute("firstx") == "") {
            CLC.setAttribute("firstx", lastx);
            CLC.setAttribute("firsty", lasty);
        }
        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + lastx.toString() + "," + y.toString());
        CLC.setAttribute("lastx", lastx.toString());
        CLC.setAttribute("lasty", y);
        if (CLC.getAttribute("secx") == "") {
            CLC.setAttribute("secx", lastx);
            CLC.setAttribute("secy", lasty);
        }
    }
}





// ============================================================





var ENTER;
var AnaliseDevice = "";
var Point = "";
var Begin;
var End;
var Step;

function Del() {
    if (document.getElementById(ElemModal.getAttribute("point")) != null)
        document.getElementById(ElemModal.getAttribute("point")).remove();
    ElemModal.remove();
    if (ElemModal.getAttribute("class") == "Lpoint") {

    }
    CloseModal();
    ElemModal = null;
}

function Rotate() {
    tmp = ElemModal.getAttribute("transform");

    switch (ElemModal.getAttribute("rotate")) {
        case "1":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "2");
            break;

        case "2":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "3");
            break;

        case "3":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "4");
            break;

        case "4":
            ElemModal.setAttribute("transform", tmp.toString() + " rotate(90)");
            ElemModal.setAttribute("rotate", "1");
            break;

    }

    ElemModal.setAttribute("new", "1");
    lineCorrect(ElemModal);
    CloseModal();
    ElemModal = null;


}

function MouseEnter(e) {
    if (e.parentNode.parentNode.tagName == "g") {
        e.style.stroke = "#000000";
        ENTER = true;
    }
}

function MouseExit(e) {
    if (e.parentNode.parentNode.tagName == "g" && ENTER) {
        e.style.stroke = "#ffffff";
        ENTER = false;
    }
}


function PolyLineCreate(e) {
    if (CLC == null) {
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
        if (e.getAttribute("class") == "n1") {
            pos = e.parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (e.getAttribute("class") == "n2") {
            pos = e.parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }

        x = (pos.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        y = (pos.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;

        line.setAttribute("points", x.toString() + "," + y.toString());
        line.setAttribute("lastx", x.toString());
        line.setAttribute("lasty", y.toString());
        line.setAttribute("stroke-width", 5);
        line.oncontextmenu = function() {
            return false;
        }
        line.addEventListener("contextmenu", function(e) {
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
    } else {
        if (parseInt(CLC.getAttribute("begin")) != e.parentNode.id) {
            document.getElementById(CLC.getAttribute("begin")).style.stroke = "#ffffff";
            ENTER = false;
            e.style.stroke = "#ffffff";

            var coords = document.getElementById("svg").getBoundingClientRect();
            var lastx = parseFloat(CLC.getAttribute("lastx"));
            var lasty = parseFloat(CLC.getAttribute("lasty"));
            var pos;
            var x;
            var y;
            if (e.getAttribute("class") == "n1") {
                pos = e.parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
            }
            if (e.getAttribute("class") == "n2") {
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


function CloseModal() {
    $('#modal_form')
        .animate({ opacity: 0, top: '45%' }, 200, // плaвнo меняем прoзрaчнoсть нa 0 и oднoвременнo двигaем oкнo вверх
            function() { // пoсле aнимaции
                $(this).css('display', 'none'); // делaем ему display: none;
                $('#overlay').fadeOut(400); // скрывaем пoдлoжку
                CUR = null;
            }
        );
}

function OpenModal() {
    $('#modal_form')
        .css('display', 'block') // убирaем у мoдaльнoгo oкнa display: none;
        .animate({ opacity: 1, top: '50%' }, 200); // плaвнo прибaвляем прoзрaчнoсть oднoвременнo сo съезжaнием вниз
}


function createGrid() {
    for (var i = -750; i < 1500; i = i + 40) {
        for (var j = -750; j < 1500; j = j + 40) {
            var cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            cir.setAttribute("r", 1);
            cir.setAttribute("cy", i);
            cir.setAttribute("cx", j);
            document.getElementById('GridGroup').appendChild(cir);
        }
    }
}

function TabSubResult(e) {
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

    switch (e.id) {
        case "a1":
            document.getElementById("nameAnalytic").innerHTML = "DC";
            SelectFill();
            SelectPoints();
            param = "";
            if (AnaliseDevice != "Не выбрано" && AnaliseDevice != undefined) {
                param = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V";

            }
            if (Point != "Не выбрано" && Point != undefined) {
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

function TabResultClick(e) {
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

function TabConstructClick(e) {
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


function Settings() {
    if (CUR.getAttribute("class") == "Lpoint") {
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
    if (CUR.getAttribute("class") == "R1") {
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
    if (CUR.getAttribute("class") == "C1") {
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
    if (CUR.getAttribute("class") == "D1") {
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
    if (CUR.getAttribute("class") == "C2") {
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

    if (CUR.getAttribute("class") == "V1") {
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

function SelectFill() {

    var list = SearchElemForSetting().split(" ");
    var sum = "<option onclick='OptionClick(this)'>" + "Не выбрано" + "</option>";
    for (i = 0; i < list.length - 1; i++) {
        if (list[i] != "") {
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

function SelectPoints() {

    var list = SearchElemPoints().split(" ");
    var sum = "<option onclick='OptionClickPoint(this)'>" + "Не выбрано" + "</option>";
    for (i = 0; i < list.length - 1; i++) {
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

function OptionClick(e) {
    var pointSetting = "";
    var deviceSetting = "";
    if (e.innerHTML == "Не выбрано") {
        AnaliseDevice = "Не выбрано";
    } else {
        if (document.getElementsByName(e.innerHTML) != null) {
            AnaliseDevice = $("[spiceName = " + e.innerHTML + "]")[0].getAttribute("spiceName");
        } else {
            AnaliseDevice = e.innerHTML;

        }
    }

    if (Point != "Не выбрано") {
        pointSetting = ".print dc v(" + Point + ")\n";
    }
    if (AnaliseDevice != "Не выбрано") {
        if (pointSetting != "Не выбрано") {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n";
        } else {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V";
        }
    }
    NETLIST = SearchElem(deviceSetting + pointSetting);

    // NETLIST = SearchElem(".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n.print dc v(" + Point + ")");
    document.getElementById('ShowNetlist').value = NETLIST;
}

function OptionClickPoint(e) {
    var pointSetting = "";
    var deviceSetting = "";
    if (e.innerHTML == "Не выбрано") {
        Point = "Не выбрано";
    } else {
        if (document.getElementsByName(e.innerHTML) != null) {
            Point = $("[name = " + e.innerHTML + "]")[0].getAttribute("lineParent");
            Point = document.getElementById(Point.toString() + "l").getAttribute("namePoint");
        } else {
            Point = e.innerHTML;
        }
    }
    if (Point != "Не выбрано") {
        pointSetting = ".print dc v(" + Point + ")\n";
    }
    if (AnaliseDevice != "Не выбрано") {
        if (pointSetting != "Не выбрано") {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n";
        } else {
            deviceSetting = ".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V";
        }
    }
    NETLIST = SearchElem(deviceSetting + pointSetting);

    // NETLIST = SearchElem(".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n.print dc v(" + Point + ")");
    document.getElementById('ShowNetlist').value = NETLIST;
}

function InputChange() {
    Begin = document.getElementById('SettingsLineBegin').value;
    End = document.getElementById('SettingsLineEnd').value;
    Step = document.getElementById('SettingsLineStep').value;
    NETLIST = SearchElem(".dc " + AnaliseDevice + " " + Begin + "V " + End + "V " + Step + "V\n.print dc v(" + Point + ")");
    document.getElementById('ShowNetlist').value = NETLIST;
    console.log(NETLIST);
}

function PropChange() {
    // this.e;
    // if (this.e.getElementsByTagName("text")[0] != undefined)
    //     this.e.getElementsByTagName("text")[0].innerHTML = document.getElementById("propName").value;
    if (this.e.getAttribute("class") == "R1") {
        this.e.getElementsByTagName("text")[0].innerHTML = document.getElementById("propNameR1").value;
        this.e.setAttribute("om", document.getElementById("R1om").value);
        this.e.setAttribute("spiceName", document.getElementById("propNameR1").value);
    }
    if (this.e.getAttribute("class") == "V1") {
        this.e.setAttribute("Volt", document.getElementById("V1V").value);
        this.e.getElementsByTagName("text")[0].innerHTML = document.getElementById("propNameV1").value;
        this.e.setAttribute("spiceName", document.getElementById("propNameV1").value);
    }
    if (this.e.getAttribute("class") == "Lpoint") {
        this.e.setAttribute("name", document.getElementById("propNamePoint").value);
        document.getElementById(this.e.getAttribute("lineParent") + "l").setAttribute("namePoint", document.getElementById("propNamePoint").value);
    }
}

function CreateMeasurePoint() {
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
    elem.addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            CUR = e.target;
            Settings();
        }
        e.ondragstart = function() {
            return false;
        };
    });
    SVG.appendChild(elem);
    CloseModal();
}

function PointCorrect(e) {
    point = document.getElementById(e.getAttribute("point"));
    point.setAttribute("cy", e.getAttribute("points").split(" ")[1].split(",")[1]);
    point.setAttribute("cx", e.getAttribute("points").split(" ")[1].split(",")[0]);
}

function CololElem() {

}

























// ============================================================


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

function SearchElemForSetting() {
    var list = "";
    var device = new Array(document.getElementsByClassName('R1'), document.getElementsByClassName('D1'), document.getElementsByClassName('C1'), document.getElementsByClassName('V1'), document.getElementsByClassName('C2'));

    for (i = 0; i < device.length; i++) {
        if (device[i] != undefined) {
            if (device[i][0] != undefined) {
                for (j = 0; j < device[i].length; j++) {
                    if (device[i][j] != undefined) {
                        list = list + device[i][j].getAttribute("spiceName") + " ";
                    }

                }
            }
        }
    }
    // console.log(list);
    return list;
}

function SearchElemPoints() {
    var list = "";
    var device = new Array(document.getElementsByClassName('Lpoint'));

    for (i = 0; i < device.length; i++) {
        if (device[i] != undefined) {
            if (device[i][0] != undefined) {
                for (j = 0; j < device[i].length; j++) {
                    if (device[i][j] != undefined) {
                        list = list + device[i][j].getAttribute("name") + " ";
                    }

                }
            }
        }
    }

    return list;
}


function SearchElem(paramAnalis) {
    var list = "";
    var line = document.getElementsByClassName('line');
    var device = new Array(document.getElementsByClassName('R1'), document.getElementsByClassName('D1'), document.getElementsByClassName('C1'), document.getElementsByClassName('V1'), document.getElementsByClassName('C2'));

    for (i = 0; i < device.length; i++) {
        if (device[i] != undefined) {
            if (device[i][0] != undefined) {
                for (j = 0; j < device[i].length; j++) {
                    if (device[i][j] != undefined) {
                        list = list + "\n" + device[i][0].getAttribute("spiceName");
                        id = device[i][j].getAttribute("id");
                        var firstPoint = "";
                        var secondPoint = "";
                        for (k = 0; k < line.length; k++) {
                            if (line[k] != undefined) {
                                idK = line[k].getAttribute("id");
                                if (line[k].getAttribute("begin").substring(0, line[k].getAttribute("begin").length - 3) == id || line[k].getAttribute("end").substring(0, line[k].getAttribute("end").length - 3) == id) {
                                    if (((line[k].getAttribute("begin").substring(0, line[k].getAttribute("begin").length - 3) == id) && (line[k].getAttribute("begin").substring(line[k].getAttribute("begin").length - 3, line[k].getAttribute("begin").length) == "228") || (line[k].getAttribute("end").substring(0, line[k].getAttribute("end").length - 3) == id) && line[k].getAttribute("end").substring(line[k].getAttribute("end").length - 3, line[k].getAttribute("end").length) == "228")) {
                                        firstPoint = line[k].getAttribute("namePoint");
                                    }

                                    if (((line[k].getAttribute("begin").substring(0, line[k].getAttribute("begin").length - 3) == id) && (line[k].getAttribute("begin").substring(line[k].getAttribute("begin").length - 3, line[k].getAttribute("begin").length) == "229") || (line[k].getAttribute("end").substring(0, line[k].getAttribute("end").length - 3) == id) && line[k].getAttribute("end").substring(line[k].getAttribute("end").length - 3, line[k].getAttribute("end").length) == "229")) {
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
    list = list + "\n.MODEL D1N3491 D (BV=" + BV + " CJO=" + CJO + " FC=" + FC + " IBV=" + IBV + " IS=" + IS + " M=" + M + " N=" + N + " RS=" + RS + " TT=" + TT + " VJ=" + VJ + ")\n" + paramAnalis + ".end";
    return list;
}

function SendNetlist() {
    $(element).find('.Test').bind('click', function() {
            $.ajax({
                type: "POST",
                url: spiceHandler,
                data: { netlist: NETLIST },
                success: console.log("ok")
            })
        })
        .done(function(response) {
            if (response.status == 'success') {
                var result = document.createElement('p');
                for (var i = 0; i < response.stdout.length; i++) {
                    result.innerHTML += response.stdout[i];
                    result.innerHTML += '<br />';
                }
                console.log("RESULT    " + result);
            } else {
                var listData;
                var stop = false;
                listData = JSON.parse(response).stdout;
                masGraph = new Array;
                for (i = 0; i < listData.length; i++) {
                    if (listData[i].toString()[0] == "0") {
                        j = i;
                        while (!stop) {
                            masGraph.push(listData[j].toString());
                            if (listData[j].toString() == "") {
                                stop = true;
                                masGraph.pop();
                            }
                            j++;
                        }
                    }
                }
                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);
            }
        })
        .fail(function() {
            console.log("E1");
        });

    console.log("NETLIST   \n" + NETLIST);

}


// ============================================================

var chart;

var lastSelect = [2];

function drawChart() {

    var point = false;
    var data2 = [
        ['V', 'I']
    ];

    document.getElementById("t1").value = "";
    document.getElementById("t2").value = "";

    for (i = 0; i < masGraph.length; i++) {
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

    function clickChart() {
        var selectedItem = chart.getSelection();
        if (selectedItem.length > 0) {
            if (lastSelect.length >= 2) {
                lastSelect.shift();
            }

            lastSelect.push({
                row: selectedItem[selectedItem.length - 1].row,
                column: selectedItem[selectedItem.length - 1].column
            });
            chart.setSelection(lastSelect);

            if (typeof lastSelect[0] == "object") {
                document.getElementById("t1").value = data.getValue(lastSelect[0].row, 0) + ";" + data.getValue(lastSelect[0].row, lastSelect[0].column);
                document.getElementById("t2").value = data.getValue(lastSelect[1].row, 0) + ";" + data.getValue(lastSelect[1].row, lastSelect[1].column);
            } else {
                document.getElementById("t1").value = data.getValue(lastSelect[1].row, 0) + ";" + data.getValue(lastSelect[1].row, lastSelect[1].column);
            }
        }
    }

    chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    google.visualization.events.addListener(chart, 'select', clickChart);


    chart.draw(data, options);
}

function clear() {

}

// =========================================

function DropDown(el) {
    this.dd = el;
    this.initEvents();
}
DropDown.prototype = {
    initEvents: function() {
        var obj = this;

        obj.dd.on('click', function(event) {
            $(this).toggleClass('active');
            event.stopPropagation();
        });
    }
}

$(function() {

    var dd = new DropDown($('#dd'));

    $(document).click(function() {
        // all dropdowns
        $('.button-result').removeClass('active');
    });

});