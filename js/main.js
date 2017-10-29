(function() {
 var DEBUG, before, c, clamp, collides, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

 c = document.getElementById('draw');

 ctx = c.getContext('2d');

 delta = 0;

 now = 0;

 before = Date.now();

 elapsed = 0;

 loading = 0;

 DEBUG = false;
//  DEBUG = true;

 c.width = 800;

 c.height = 600;

 keysDown = {};

 keysPressed = {};

 images = [];

 audios = [];

 framesThisSecond = 0;
 fpsElapsed = 0;
 fps = 0

 popups = [];
 toBoom = 0.5;
 toToBoom = 0.5;
 boom = {};

 window.addEventListener("keydown", function(e) {
         keysDown[e.keyCode] = true;
         return keysPressed[e.keyCode] = true;
         }, false);

 window.addEventListener("keyup", function(e) {
         return delete keysDown[e.keyCode];
         }, false);

 setDelta = function() {
     now = Date.now();
     delta = (now - before) / 1000;
     return before = now;
 };

 if (!DEBUG) {
     console.log = function() {
         return null;
     };
 }

 ogre = false;

 clamp = function(v, min, max) {
     if (v < min) {
         return min;
     } else if (v > max) {
         return max;
     } else {
         return v;
     }
 };

 collides = function(a, b, as, bs) {
     return a.x + as > b.x && a.x < b.x + bs && a.y + as > b.y && a.y < b.y + bs;
 };

 player = {
   x: 200,
   y: 300,
 }

 obstacles = [
    {
        x: 800,
        y: 100,
        s: 20,
    }
 ];

 food = [
    {
        x: 650,
        y: 200,
        s: 20,
    }
 ];

 tail = [];

 tick = function() {
     setDelta();
     elapsed += delta;
     update(delta);
     draw(delta);
     keysPressed = {};
     if (!ogre) {
         return window.requestAnimationFrame(tick);
     }
 };

 speed = 80;

 update = function(delta) {
     console.log(speed);

     framesThisSecond += 1;
     fpsElapsed += delta;

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }


     if(keysDown[65]) {
         // player.x = 0;
     } else if(keysDown[68]) {
         // player.x = 1;
     } else if(keysDown[83] && player.y <= (600 - 16)) {
         player.y += delta * speed * 1.2;
     } else if(keysDown[87] && player.y >= 0) {
         player.y -= delta * speed * 1.2;
     }

    console.log(keysDown)

    toBoom -= delta;
    if(toBoom <= 0) {
        toBoom = toToBoom;

        speed += 1;
    }

    if(obstacles[obstacles.length - 1].x < 500 + Math.random() * 100) {
        obstacles.push({
            x: 800,
            y: Math.random() * 500 + 50,
            s: Math.random() * 120 + 20,
        });
    }

    if(food[food.length - 1].x < 500 + Math.random() * 100) {
        food.push({
            x: 800,
            y: Math.random() * 500 + 50,
            s: Math.random() * 25 + 5,
        });
    }

    for(var i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= delta * speed;

        if(collides(player, obstacles[i], 16, obstacles[i].s)) {
            ogre = true;
        }
    }

    var i = food.length;
    while(i--) {
        food[i].x -= delta * speed;

        if(collides(player, food[i], 16, food[i].s)) {
            speed += Math.round(food[i].s);
            food.splice(i, 1);
        }
    }

    tail.push({
        x: player.x,
        y: player.y,
    });

    for(var i = 0; i < tail.length; i++) {
        tail[i].x -= delta * speed;
    }

 };

 draw = function(delta) {
     ctx.fillStyle = "#aaffaa";
     ctx.fillRect(0, 0, c.width, c.height);

     if(DEBUG) {
        ctx.fillStyle = "#888888";
        ctx.font = "20px Visitor";
        ctx.fillText(Math.round(fps), 10, 40);
     }

    ctx.fillStyle = "#000000";
    ctx.font = "20px Visitor";
    ctx.fillText("score: " + (speed - 80), 10, 20);

     ctx.fillStyle = "#521515";

     for(var i = 0; i < obstacles.length; i++) {
         var obstacle = obstacles[i];
         ctx.fillRect(obstacle.x, obstacle.y, obstacle.s, obstacle.s);
     }

     ctx.fillStyle = "#ee1111";

     for(var i = 0; i < food.length; i++) {
         var f = food[i];
         ctx.fillRect(f.x, f.y, f.s, f.s);
     }

     ctx.fillStyle = "#007700";
     for(var i = 0; i < tail.length; i++) {
         var t = tail[i];
         ctx.fillRect(t.x, t.y + 1, 14, 14);
     }

     ctx.fillStyle = "#007700";
     ctx.fillRect(player.x, player.y, 16, 16);
     ctx.fillStyle = "#000000";
     ctx.fillRect(player.x + 10, player.y + 2, 4, 4);
     ctx.fillRect(player.x + 10, player.y + 10, 4, 4);
     ctx.fillStyle = "#ff0000";
     ctx.fillRect(player.x + 16, player.y + 6, 8, 4);

     if(ogre) {
        ctx.fillStyle = "#000000";
        ctx.font = "120px Visitor";
        ctx.fillText("¯\\_(ツ)_/¯", 100, 240);
        ctx.fillText("score: " + (speed - 80), 80, 400);
     }
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

 loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }



//  loadImage("meskam");

//  audios["jeb"] = new Audio('sounds/jeb.ogg');
//  audios["ultimate_jeb"] = new Audio("sounds/ultimate_jeb.ogg");

//  loadMusic("melody1");

 load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 load();

}).call(this);
