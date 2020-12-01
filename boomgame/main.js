// INIT
const canvas = getObject("#canvas")
const ctx = canvas.getContext("2d");
const prb = getObject("button")
// VARS
var bombs = [];
var nuclearbombs = [];
var bombtype = getObject(".bombtype").checked;
// CODE


function render() {
  renderBomb();
  renderNuclearBomb();
}

function mousedown(event) {
  bombtype = getObject(".bombtype").checked;
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
  bombs[0].pt = 1;
  clearBomb(bombs,ctx);
  setTimeout(unprime,1000)
}

function unprime() {
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
  nuclearbombs[0].pt = 1;
  setTimeout(unprimenuclear,2000);
}
function unprimenuclear() {
  nuclearbombs = [];
}

function createNuclearBomb(pos) {
  var nuclear = new Nuclearbomb(pos.x,pos.y);
  nuclearbombs.push(nuclear);
}
// INIT CODE
function startGameEngine() {
  render();
  setTimeout(startGameEngine, 40);
}
// EVENTS
canvas.addEventListener('mousedown',function(e){mousedown(event)});
prb.addEventListener('click', function(e){if(bombtype == false) primeBombs(); else primeNuclear()});
// START
startGameEngine();
