var CUR = null; //нажатый элемент
var COUNT = 0; // ID элементов
var R1 = 1;
var C1 = 1;
var D1 = 1;
var V1 = 1;
var CLC = null;  // для соединения точками
var ElemModal = null;
var SVG;
var NEWELEM = null;
var SHIFT = 0;

window.onload = function ()
{
    SVG = document.getElementById('svggroup');
    document.getElementById('m1').addEventListener("click", function ()
    {
        NEWELEM = "R1";
    });
    document.getElementById('m2').addEventListener("click", function ()
    {
        NEWELEM = "C1";
    });
    document.getElementById('m3').addEventListener("click", function ()
    {
        NEWELEM = "C2";
    });
    document.getElementById('m4').addEventListener("click", function ()
    {
        NEWELEM = "V1";
    });
    document.getElementById('m5').addEventListener("click", function ()
    {
        NEWELEM = "D1";
    });
    document.getElementById('button-construct').style.background = "#C5C5C5";
    document.getElementById("svg").oncontextmenu = function ()
    {
        return false;
    }
    createGrid();

    $('#modal_close, #overlay').click(function ()
    {
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

}

$(document).keydown(function (e)
{
    if (e.keyCode === 27)
    {
        if (CLC)
        {
            document.getElementById(CLC.getAttribute("begin")).style.stroke = "#ffffff";
            CLC.remove();
            ENTER = false;
            CLC = null;
        }
    }
});

document.onmousemove = function (e)
{
    if (NEWELEM == "R1")
    {
        createElem("resistor1", e);
    }

    if (NEWELEM == "C1")
    {
        createElem("kondencator1", e);
    }

    if (NEWELEM == "C2")
    {
        createElem("kondencator2", e);
    }

    if (NEWELEM == "V1")
    {
        createElem("batary", e);
    }

    if (NEWELEM == "D1")
    {
        createElem("diod1", e);
    }

    if (CUR != null && !ENTER)
    {
        var coords = document.getElementById("svg").getBoundingClientRect();
        var x = (Number(e.clientX - coords.left) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
        var y = (Number(e.clientY - coords.top) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
        var cx;
        var cy;

        cx = x - parseFloat(CUR.getAttribute('x'));
        cy = parseFloat(CUR.getAttribute('y')) + y;

        CUR.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')');
        tmp = CUR.getAttribute("transform");
        if (CUR.getAttribute("new") != "0")
        {
            if (parseInt(CUR.getAttribute("rotate")) == "1")
            {
                CUR.setAttribute("transform", tmp.toString() + " rotate(0)");
            }
            if (parseInt(CUR.getAttribute("rotate")) == "2")
            {
                CUR.setAttribute("transform", tmp.toString() + " rotate(90)");
            }
            if (parseInt(CUR.getAttribute("rotate")) == "3")
            {
                CUR.setAttribute("transform", tmp.toString() + " rotate(180)");
            }
            if (parseInt(CUR.getAttribute("rotate")) == "4")
            {
                CUR.setAttribute("transform", tmp.toString() + " rotate(270)");
            }
        }
        else
        {
            CUR.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')');
        }


        lineCorrect(CUR);
        CLC = null;
    }
};

document.onmouseup = function (e)
{
    if (e.which == 1)
    {
        if (CUR != null)
        {
            var x = parseInt(CUR.getAttribute("x"));
            var y = parseInt(CUR.getAttribute("y"));
            if (x % 40 != 0)
            {
                x = x + x % 40;
            }
            if (y % 40 != 0)
            {
                y = y + y % 40;
            }
            CUR.setAttribute("x", x);
            CUR.setAttribute("y", y);
        }
    }
    CUR = null;
};

function lineCorrect(link)
{
    if (!CLC)
    {
        var coords = document.getElementById("svg").getBoundingClientRect();
        if (link.getElementsByTagName("circle")[0].getAttribute("class") == "n1")
        {
            pos = link.getElementsByTagName("circle")[0].parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (link.getElementsByTagName("circle")[0].getAttribute("class") == "n2")
        {
            pos = link.getElementsByTagName("circle")[0].parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }
        if (link.getElementsByTagName("circle")[1].getAttribute("class") == "n1")
        {
            pos1 = link.getElementsByTagName("circle")[1].parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (link.getElementsByTagName("circle")[1].getAttribute("class") == "n2")
        {
            pos1 = link.getElementsByTagName("circle")[1].parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }
        x = (pos.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        y = (pos.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;

        x1 = (pos1.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        y1 = (pos1.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;


        for (var i = 0; i < SVG.children.length; i++)
        {
            if (SVG.children[i].getAttribute("begin"))
            {
                if (SVG.children[i].getAttribute("begin") == link.getElementsByClassName("n1")[0].id.toString())
                {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[1];
                    points = "";
                    for (j = 2; j < length; j++)
                    {
                        if (j != length - 1)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else
                        {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }
                    if ((Math.abs(x - lastx)) < (Math.abs(y - lasty)))
                    {
                        SVG.children[i].setAttribute("points", x.toString() + "," + y.toString() + " " + lastx.toString() + "," + y.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                    else
                    {
                        SVG.children[i].setAttribute("points", x.toString() + "," + y.toString() + " " + x.toString() + "," + lasty.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }
                if (SVG.children[i].getAttribute("begin") == link.getElementsByClassName("n2")[0].id.toString())
                {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[2].split(",")[1];
                    points = "";
                    for (j = 2; j < length; j++)
                    {
                        if (j != length - 1)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else
                        {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }
                    if ((Math.abs(x1 - lastx)) < (Math.abs(y1 - lasty)))
                    {
                        SVG.children[i].setAttribute("points", x1.toString() + "," + y1.toString() + " " + lastx.toString() + "," + y1.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                    else
                    {
                        SVG.children[i].setAttribute("points", x1.toString() + "," + y1.toString() + " " + x1.toString() + "," + lasty.toString() + " " + points);
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }
            }
            if (SVG.children[i].getAttribute("end"))
            {
                if (SVG.children[i].getAttribute("end") == link.getElementsByClassName("n1")[0].id.toString())
                {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[1];
                    points = "";
                    for (j = 0; j < length - 2; j++)
                    {
                        if (j != length - 3)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else
                        {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }
                    if ((Math.abs(x - lastx)) < (Math.abs(y - lasty)))
                    {
                        SVG.children[i].setAttribute("points", points + " " + lastx.toString() + "," + y.toString() + " " + x.toString() + "," + y.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                    else
                    {
                        SVG.children[i].setAttribute("points", points + " " + x.toString() + "," + lasty.toString() + " " + x.toString() + "," + y.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }

                if (SVG.children[i].getAttribute("end") == link.getElementsByClassName("n2")[0].id.toString())
                {
                    length = SVG.children[i].getAttribute("points").split(" ").length;
                    lastx = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[0];
                    lasty = SVG.children[i].getAttribute("points").split(" ")[length - 3].split(",")[1];
                    points = "";
                    for (j = 0; j < length - 2; j++)
                    {
                        if (j != length - 3)
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j] + " ";
                        else
                        {
                            points = points + SVG.children[i].getAttribute("points").split(" ")[j];
                        }
                    }

                    if ((Math.abs(x1 - lastx)) < (Math.abs(y1 - lasty)))
                    {
                        SVG.children[i].setAttribute("points", points + " " + lastx.toString() + "," + y1.toString() + " " + x1.toString() + "," + y1.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                    else
                    {
                        SVG.children[i].setAttribute("points", points + " " + x1.toString() + "," + lasty.toString() + " " + x1.toString() + "," + y1.toString());
                        if (SVG.children[i].getAttribute("point") != undefined)
                            PointCorrect(SVG.children[i]);
                    }
                }
            }
        }
    }
}

function createElem(type, e)
{

    var elem = document.getElementById(type.toString()).cloneNode(true);
    switch (type.toString())
    {
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
    elem.addEventListener("mousedown", function (e)
    {
        if (e.which == 1 && !ENTER)
        {
            CUR = e.target.parentNode;
            Settings();

        }
        e.ondragstart = function ()
        {
            return false;
        };
    });

    elem.oncontextmenu = function ()
    {
        return false;
    }

    elem.addEventListener("contextmenu", function (e)
    {
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

function scale()
{
    size = document.getElementById("size").value;
    SVG.setAttribute("transform", "scale(" + size + " )");
    document.getElementById("scaleText").innerHTML = "Масштаб  " + size.toString();


    switch (size)
    {
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


function getCookie(name)
{
    var cookieValue = null;
    if (document.cookie && document.cookie !== '')
    {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++)
        {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '='))
            {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

document.onmousedown = function (e)
{
    if (CLC)
    {

        var coords = document.getElementById("svg").getBoundingClientRect();
        var x = (Number(e.clientX - coords.left) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
        var y = (Number(e.clientY - coords.top) / document.getElementById("size").value) + SHIFT / document.getElementById("size").value;
        var begin = document.getElementById(CLC.getAttribute("begin"));
        var pos;

        if (begin.getAttribute("class") == "n1")
        {
            pos = begin.parentNode.getElementsByClassName("h1")[0].getBoundingClientRect();
        }
        if (begin.getAttribute("class") == "n2")
        {
            pos = begin.parentNode.getElementsByClassName("h2")[0].getBoundingClientRect();
        }

        var bx = (pos.left - coords.left) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;
        var by = (pos.top - coords.top) / document.getElementById("size").value + SHIFT / document.getElementById("size").value;

        if ((Math.abs(bx - x) > 20) || (Math.abs(by - y) > 20))
        {
            AddLine(x, y);
        }

    }
}

function AddLine(x, y)
{

    var lastx = parseFloat(CLC.getAttribute("lastx"));
    var lasty = parseFloat(CLC.getAttribute("lasty"));


    if ((Math.abs(x - lastx)) < (Math.abs(y - lasty)))
    {

        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + lastx.toString() + "," + y.toString());
        CLC.setAttribute("lastx", lastx.toString());
        CLC.setAttribute("lasty", y);
        lastx = parseFloat(CLC.getAttribute("lastx"));
        lasty = parseFloat(CLC.getAttribute("lasty"));
        if (CLC.getAttribute("firstx") == "")
        {
            CLC.setAttribute("firstx", lastx);
            CLC.setAttribute("firsty", lasty);
        }
        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + x.toString() + "," + lasty.toString());
        CLC.setAttribute("lastx", x.toString());
        CLC.setAttribute("lasty", lasty.toString());
        if (CLC.getAttribute("secx") == "")
        {
            CLC.setAttribute("secx", lastx);
            CLC.setAttribute("secy", lasty);
        }
    }
    else
    {
        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + x.toString() + "," + lasty.toString());
        CLC.setAttribute("lastx", x.toString());
        CLC.setAttribute("lasty", lasty.toString());
        lastx = parseFloat(CLC.getAttribute("lastx"));
        lasty = parseFloat(CLC.getAttribute("lasty"));
        if (CLC.getAttribute("firstx") == "")
        {
            CLC.setAttribute("firstx", lastx);
            CLC.setAttribute("firsty", lasty);
        }
        var tmp = CLC.getAttribute("points");
        CLC.setAttribute("points", tmp + " " + lastx.toString() + "," + y.toString());
        CLC.setAttribute("lastx", lastx.toString());
        CLC.setAttribute("lasty", y);
        if (CLC.getAttribute("secx") == "")
        {
            CLC.setAttribute("secx", lastx);
            CLC.setAttribute("secy", lasty);
        }
    }
}


