// INIT
const canvas = getObject("#canvas")
const ctx = canvas.getContext("2d");
const prb = getObject("button")
const btobject = getObject(".bombtype")
// VARS
var bombs = [];
var nuclearbombs = [];
var bombtype = getObject(".bombtype").checked;
var primed = 0;
var windowsize = [window.innerWidth, window.innerHeight];
var fps = Math.round((1/20)*1000) - 1
// CODE


function render() {
  if(bombtype == false) {
    renderBomb();
  } else {
    renderNuclearBomb();
  }
}

function updateBombType() {
    bombtype = getObject(".bombtype").checked;
}

function mousedown(event) {
  if(bombtype == false)
    createBomb(getPos(canvas,event))
  else
    createNuclearBomb(getPos(canvas,event))
}

// NORMAL BOMB
function renderBomb() {
  if(bombs.length != 0) {
    drawBomb(bombs,ctx);
  }
}

function primeBombs() {
  if(primed == 1 || bombs.length == 0) return;
  primed = 1;
  bombs[0].pt = 1;
  clearBomb(bombs,ctx);
  setTimeout(unprime,1000)
}

function unprime() {
  primed = 0;
  clearBomb(bombs,ctx);
  bombs = [];
}

function createBomb(pos) {
  var bomb = new Bomb(pos.x,pos.y);
  bombs.push(bomb)
}

// NUCLEAR Bomb

function renderNuclearBomb() {
  if(nuclearbombs.length != 0)
    drawNuclearBomb(nuclearbombs,ctx);
}

function primeNuclear() {
  if(primed == 1 || nuclearbombs.length == 0) return;
  primed = 1;
  nuclearbombs[0].pt = 1;
  setTimeout(unprimenuclear,2000);
}
function unprimenuclear() {
  primed = 0;
  nuclearbombs = [];
}

function createNuclearBomb(pos) {
  var nuclear = new Nuclearbomb(pos.x,pos.y);
  nuclearbombs.push(nuclear);
}
// INIT CODE
function primeSelectedBombs() {
  if (bombtype == false) {
    primeBombs();
  } else if(bombtype == true) {
    primeNuclear();
  } else {
    console.err("Could not prime Bombs!")
  }
}

btobject.addEventListener('change', (event) => {
  updateBombType();
})

function openMenue() {
  if(getObject(".menuoverlay").style.display == "")
    getObject(".menuoverlay").style.display = "none"

  if(getObject(".menuoverlay").style.display == "none") {
    getObject(".menuoverlay").style.display = "flex"
  } else {
    getObject(".menuoverlay").style.display = "none"
  }
}

function startGameEngine() {
  render();
  setTimeout(startGameEngine, fps);
}
// EVENTS
canvas.addEventListener('mousedown',function(e){mousedown(event);});
prb.addEventListener('click', function(e){ primeSelectedBombs(); });
btobject.addEventListener('change', (event) => {updateBombType();})
getObject(".menu").addEventListener("click",function(e){openMenue()})
getObject(".option1").addEventListener("click", () => {
  getObject(".option1").style.background = "#02b302";
  getObject(".option2").style.background = "white";
  getObject(".option3").style.background = "white";
  fps = Math.round((1/120)*1000) - 1
})
getObject(".option2").addEventListener("click", () => {
  getObject(".option1").style.background = "white";
  getObject(".option2").style.background = "#02b302";
  getObject(".option3").style.background = "white";
  fps = Math.round((1/60)*1000) - 1
})
getObject(".option3").addEventListener("click", () => {
  getObject(".option1").style.background = "white";
  getObject(".option2").style.background = "white";
  getObject(".option3").style.background = "#02b302";
  fps = Math.round((1/20)*1000) - 1})
// START
getObject(".menuoverlay").style.display = "none";
updateGameEngine();
startGameEngine();
