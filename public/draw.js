document.addEventListener("DOMContentLoaded", function() {
    var mouse = {
        click: false,
        move: false,
        pos: {x:0, y:0},
        pos_prev: false
    };

    // get canvas element and create context
    var canvas  = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    var width   =  window.innerWidth * 0.45;
    var height  = window.innerHeight * 0.65;
    var socket  = io.connect();

    // set canvas to full browser width/height
    canvas.width = width;
    canvas.height = height;

    // mouse event handlers
    canvas.onmousedown = function(e){ mouse.click = true; };
    canvas.onmouseup = function(e){ mouse.click = false; };

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / canvas.width,
            y: (evt.clientY - rect.top)  /canvas.height
        };
    }

    canvas.onmousemove = function(e) {
        //mouse pos to range 0.0 - 1.0
        mouse.pos = getMousePos(canvas, e);
        mouse.move = true;
    };

    document.getElementById('clear_button').addEventListener("click",function(){
        socket.emit('clear_canvas');
    });

    // draw server
    socket.on('draw_line', function (data) {
        var line = data.line;
        context.beginPath();
        context.moveTo(line[1].x * canvas.width, line[1].y *  canvas.height );
        context.lineTo(line[0].x * canvas.width, line[0].y * canvas.height );
        context.strokeStyle= 'black';
        context.lineWidth = 15;
        context.stroke();
    });

    socket.on('clear_canvas', function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    // main loop after every 25ms
    function mainLoop() {
        // check if the user is drawing
        if (mouse.click && mouse.move && mouse.pos_prev) {
            // send line to to the server
            socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev] });
            mouse.move = false;
        }
        mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(mainLoop, 25);
    }
    mainLoop();
});