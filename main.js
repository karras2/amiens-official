const canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");
canvas.oncontextmenu = function(e) {
    e.preventDefault();
};
const config = {
    font: "Overpass",
    screenWidth: 0,
    screenHeight: 0,
    gameState: 0,
    gameStates: {
        description: 0,
        menu: 1,
    },
    descriptionSlidingDown: false,
};
let animations = {
    description: 1,
    descriptionSlide: 1,
    descriptionSlideDown: 0,
    menuSlide: 1,
    menuFade: 1,
};
let colors = ["#ffffff" /* Real white */ , "#000000" /* Real black */ , "#f3f6fb" /* White */ , "#2F2C30" /* Black */, "#a3a7b0" /* Grey */, "#0f5d20" /* Dirt */] // TAKEN FROM KANONO BECAUSE IM TOO LAZY TO REMAKE MY ASSETS
const util = {};
util.fullScreenCanvas = function() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    config.screenWidth = canvas.width;
    config.screenHeight = canvas.height;
};
util.fullScreenCanvas(canvas);
window.onresize = function() {
    util.fullScreenCanvas(canvas);
};
util.lerp = function(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
};
util.drawText = function(ctx, content, x, y, size, align = "center", stroke = true) {
    ctx.textAlign = align;
    ctx.font = "900 " + size + "px " + config.font;
    if (stroke) {
        ctx.save();
        ctx.lineJoin = "round";
        ctx.fillStyle = colors[3];
        ctx.strokeStyle = colors[3];
        ctx.lineWidth = size / 5;
        ctx.strokeText(content, x, y);
    };
    ctx.restore();
    ctx.fillText(content, x, y);
};
util.mixColors = function(colorA, colorB, amount) {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
    return '#' + r + g + b;
};
let player = {
  camera: {
    x: 0,
    y: 0,
  },
  x: 0,
  y: 0,
};
onkeydown = function(e) {
    switch(e.keyCode) {
      case 87:
        player.y-=5;
        break;
      case 83:
        player.y+=5;
        break;
      case 65:
        player.x-=5;
        break;
      case 68:
        player.x+=5;
        break;
    }
};
let room = {
    width: 100,
    height: 100,
    cells: (function(){
        let array = []
        for (let i = 0; i < 100 * 100; i++) {
            array.push({
                color: util.mixColors(colors[5], "#ffffff", Math.random() / 10),
                type: 1,
            });
        };
        return array;
    })(),
    cellSize: 10,
};
const loop = function(){
    if (config.gameState == config.gameStates.description) {
      animations.descriptionSlide = util.lerp(animations.descriptionSlide, 0, 0.05);
      animations.description = util.lerp(animations.descriptionSlide, 0, 0.1);
      if (config.descriptionSlidingDown) {
        animations.descriptionSlideDown = util.lerp(animations.descriptionSlideDown, 1, 0.05);
        if (animations.descriptionSlideDown > 0.99) config.gameState = config.gameStates.menu;
      };
      ctx.fillStyle = colors[1];
      ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
      ctx.fillStyle = colors[0];
      let y = (animations.descriptionSlide - animations.descriptionSlideDown) * config.screenHeight;
      util.drawText(ctx, "amiens.io", config.screenWidth / 2, config.screenHeight / 2 - y, 50);
      ctx.fillStyle = colors[0];
      ctx.globalAlpha = animations.description;
      ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
      ctx.globalAlpha = 1;
    };
    // ingame
    if (config.gameState == config.gameStates.menu || config.gameState == config.gameStates.ingame) {
      player.camera.x = util.lerp(player.camera.x, player.x, 0.05);
      player.camera.y = util.lerp(player.camera.y, player.y, 0.05);
      ctx.fillStyle = colors[4];
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
      ctx.translate(Math.floor(config.screenWidth / 2 - player.camera.x), Math.floor(config.screenHeight / 2 - player.camera.y));
      for (let i = 0; i < room.width * room.height; i++) {
        ctx.fillStyle = room.cells[i].color;
        ctx.fillRect(((i % 100) * 10) - room.width * 5, (Math.floor(i / 100) * 10) - room.height * 5, 10, 10);
      };
    };
    ctx.resetTransform();
    // menu
    if (config.gameState == config.gameStates.menu) {
      ctx.fillStyle = colors[0];
      animations.menuSlide = util.lerp(animations.menuSlide, 0, 0.05);
      let y = (animations.menuSlide) * config.screenHeight;
      util.drawText(ctx, "Joining Room...", config.screenWidth / 2, config.screenHeight / 2 - y, 50);
      util.drawText(ctx, "This may take a momment!", config.screenWidth / 2, config.screenHeight / 2 + 50 - y, 20);
      animations.menuFade = util.lerp(animations.menuFade, 0, 0.1);
      ctx.fillStyle = colors[1];
      ctx.globalAlpha = animations.menuFade;
      ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
      ctx.globalAlpha = 1;
    };
    requestAnimationFrame(loop);
};
setTimeout(()=>{config.descriptionSlidingDown = true}, 4000);
setTimeout(()=>{window.location.replace("http://www.w3schools.com")}, 12000);
loop();
