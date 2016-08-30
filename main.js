var canvas = document.getElementById('holst');
var context;

if (canvas && canvas.getContext) {
    var m = [];
    var m2 = [];
    var interval_id, request_id;
    var auto = false;
    var MaxScale = 200;
    var OffOnNet = true;
    scale.max = MaxScale;

    stat_div.onclick = function(e) {
        s = e.target.src;
        n = s[s.indexOf(".png") - 1];
        textt.value = save[n];
        loader();
    }
    var n = +MaxScale + 2;

    for (i = 0; i < n; i++) {
        m[i] = [];
        m2[i] = [];
        for (j = 0; j < n; j++) {
            m[i][j] = 0;
            m2[i][j] = 0;
        }
    }

    context = canvas.getContext('2d');
    Resizer();
    canvas.onmousedown = add_cell;
}

function change_scale(a) {
    if (a == 0) {
        scale.value--;
    }
    if (a == 1) {
        scale.value++;
    }
    scale_value.value = scale.value;
    make_desk();
}

function change_steps(a) {
    if ((a == 1) || (auto)) {
        steps.value++;
    }
    steps_value.value = steps.value;
    next_step();
}

function change_speed(a) {
    if (a == 0) {
        speed.value -= 1;
    }
    if (a == 1) {
        speed.value = +speed.value + 1;
    }
    speed_value.value = speed.value;
}

function Resizer() {
    var canvas_size;
    if (window.innerWidth > window.innerHeight) {
        canvas_size = (window.innerHeight * 4) / 5;
    } else {
        canvas_size = (window.innerWidth * 6) / 10;
    }
    canvas.width = canvas.height = canvas_size;
    make_desk(scale.value);
}

function draw_cell(xi, yj, l) {
    w = canvas.width / scale.value;
    var x = (xi - 1) * w;
    var y = (yj - 1) * w;
    if (l == 1) {
        context.fillStyle = '#00FF00';
        context.fillRect(x + 1, y + 1, w - 2, w - 2);
    }
    if (l == 0) {
        context.fillStyle = '#000000';
        (OffOnNet) ? context.fillRect(x + 1, y + 1, w - 2, w - 2):
            context.fillRect(x - 1, y - 1, w + 1, w + 1);
    }
}

function make_desk() {
    var n = scale.value;
    var wh = canvas.width;
    context.clearRect(0, 0, wh, wh);
    if (OffOnNet) {
        var size = wh / n;
        var x, y;
        context.strokeStyle = "rgba(248,248,248,1)";
        context.lineWidth = 1;
        context.strokeRect(0, 0, wh, wh);
        context.beginPath();
        for (i = 1; i < n; i += 1) {
            x = Math.floor(size * i) + 0.5;
            context.moveTo(x, 0);
            context.lineTo(x, wh);
        }
        for (i = 1; i < n; i += 1) {
            y = Math.floor(size * i) + 0.5;
            context.moveTo(0, y);
            context.lineTo(wh, y);
        }
        context.stroke();
        context.closePath();
    };
    n = +MaxScale + 1;
    for (i = 1; i < n; i++)
        for (j = 1; j < n; j++)
            if (m[i][j] == 1) {
                draw_cell(i, j, 1);
            }
}

function getpixel(x1, y1) {
    var p = context.getImageData(x1, y1, 1, 1).data;
    if ((p[0] == 0) && (p[1] == 0) && (p[2] == 0)) {
        return 0;
    } else
    if ((p[0] == 0) && (p[1] == 255) && (p[2] == 0)) {
        return 1;
    };
}

function add_cell() {
    var x, y, w;
    var nX, nY; // номер клетки в массиве по x и y

    x = event.pageX - (window.innerWidth / 5);
    y = event.pageY;
    if (getpixel(x, y) == 0) {
        w = (canvas.width / scale.value);
        nX = Math.floor(x / w);
        nY = Math.floor(y / w);
        draw_cell(+nX + 1, +nY + 1, 1);
        m[+nX + 1][+nY + 1] = 1;
    } else
    if (getpixel(x, y) == 1) {
        w = (canvas.width / scale.value);
        nX = Math.floor(x / w);
        nY = Math.floor(y / w);
        draw_cell(+nX + 1, +nY + 1, 0);
        m[+nX + 1][+nY + 1] = 0;
    };

}

function check_life(ii, jj) {
    var summ = 0;
    summ += m[ii - 1][jj - 1];
    summ += m[ii][jj - 1];
    summ += m[ii + 1][jj - 1];

    summ += m[ii - 1][jj];
    summ += m[ii + 1][jj];

    summ += m[ii - 1][jj + 1];
    summ += m[ii][jj + 1];
    summ += m[ii + 1][jj + 1];
    return summ;
}

function next_step() {
    var n = scale.value;
    var n1 = +n + 1;
    m[0][0] = m[n][n];
    m[n1][n1] = m[1][1];
    m[n1][0] = m[1][n];
    m[0][n1] = m[n][1];
    for (i = 1; i < n1; i++) {
        m[0][i] = m[n][i];
        m[n1][i] = m[1][i];
        m[i][0] = m[i][n];
        m[i][n1] = m[i][1];
    }
    n++;
    for (i = 1; i < n; i++)
        for (j = 1; j < n; j++) {
            if (check_life(i, j) == 3) {
                m2[i][j] = 1;
                if (m[i][j] == 0) {
                    draw_cell(i, j, 1)
                }
            } else
            if ((check_life(i, j) == 2) && (m[i][j] == 1)) {
                m2[i][j] = 1;
            } else {
                m2[i][j] = 0;
                if (m[i][j] == 1) {
                    draw_cell(i, j, 0)
                }
            }
        }
    for (i = 1; i < n; i++)
        for (j = 1; j < n; j++) {
            m[i][j] = m2[i][j];
        }
}

function play() {
    if (!auto) {
        auto = true;
        interval_id = setInterval(change_steps, speed.value);
    }
}

function stop() {
    if (auto) {
        auto = false;
        clearInterval(interval_id);
    }
}

function clean() {
    if (!auto) {
        n = +MaxScale + 2;
        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++) {
                m[i][j] = 0;
            }
        make_desk();
    }
}

function saver() {
    var s = "";
    var n = scale.value;
    var code = String(n);
    var k = 0;
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= n; j++) {
            k++;
            s += String(m[i][j]);
            if (k == 6) {
                k = str2.indexOf(s);
                code += str64[k];
                s = "";
                k = 0;
            }
        }
    }
    if (k > 0) {
        for (i = k; i < 6; i++)
            s += "0";
        console.log(s);
        k = str2.indexOf(s);
        code += str64[k];
    }
    textt.value = code;
}

function loader() {
    var s1 = textt.value; // считываем код из textaria
    var n = Number(s1[0] + s1[1]); // размер массива (игрового поля)
    if (s1[0] == "1") n = Number(s1[0] + s1[1] + s1[2]);
    if ((s1.length != 0) && (n >= 30) && (n <= MaxScale)) {
        scale.value = n;
        scale_value.value = n;
        clean();
        var codeN = 2; // номер элемента в s1
        var indx = str64.indexOf(s1[codeN]); // ищем номер двоичного аналога
        var s2 = str2[indx]; // берем двоичный аналог
        var stepN = 0; // номер элемента в двоичном аналоге, который сейчас записываем
        for (i = 1; i <= n; i++) {
            for (j = 1; j <= n; j++) {
                m[i][j] = Number(s2[stepN]);
                stepN++;
                if (stepN == 6) {
                    codeN++;
                    indx = str64.indexOf(s1[codeN]);
                    s2 = str2[indx];
                    stepN = 0;
                }
            }
        }
        make_desk();
    } else alert("Не верный код");
}

function NetOnOff() {
    (OffOnNet) ? OffOnNet = false: OffOnNet = true;
    make_desk();
}
/*
function ris() {
    var k = 1;
    var l = 1;
    scale.value = 100;
    clean();
    for (i = 1; i <= 100; i++) {
        if (i == l) l += 3;
        else
            for (j = 1; j <= 100; j++) {
                if (j == k) {
                    k += 3;
                    m[i][j] = 0;
                } else m[i][j] = 1;
            }
        k = 1;
    }
    make_desk();
}
*/
