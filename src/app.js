const canvas = document.getElementById("canvas");
const canvasGrid = document.getElementById("canvas-grid");
const canvasSnow = document.getElementById("canvas-snow");
var mouseX = 0;
var mouseY = 0;
var btnPlay = new Button(417, 559, 171, 228)
var snow = createSnow(canvasSnow);

window.onload = function() {
  const ctx = canvasGrid.getContext("2d");
  loadMenu(ctx)
  document.addEventListener('click', playBtnClicked, false)
}

function loadMenu(ctx) {
  let img = new Image();
  img.src = ("./assets/bg.png");
  img.onload = function() {
    ctx.drawImage(img, 0, 0, 800, 600, 0, 0, 800, 600)
  }  
  setInterval(snow.draw, 33);
}

function startGame() {
  let ctx = canvasGrid.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let game = new Game(canvas);
  // let img = new Image();
  // img.src = ("./assets/bg_main.jpg");
  // img.onload = function () {
  //   ctx.drawImage(img, 0, 0, 800, 600, 0, 0, 800, 600)
  // }  
  createGrid()
  game.addWeapon(new Weapon(700, 0, game));
  game.addWeapon(new Weapon(700, 100, game));
  game.addWeapon(new Weapon(700, 200, game));
  game.addWeapon(new Weapon(700, 300, game));

  setInterval(() => {
    if (game.inGame) {
      game.addElf(new Elf(game));
    }

  }, 5000);
}

function playBtnClicked(e) {
  mouseX = e.pageX - canvas.offsetLeft;
  mouseY = e.pageY - canvas.offsetTop;
  if (btnPlay.isClicked(mouseX, mouseY)) {
    startGame()
  };
}
