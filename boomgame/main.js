// INIT
const canvas = getObject("#canvas")
const ctx = canvas.getContext("2d");
const prb = getObject("button")
// VARS
var bombs = [];
var ba = 0;
// CODE

function update() {
  if(ba == 1) {
    if(bombs.length != 0) {
      bombs.forEach(function(item, index) {
        item.clear(ctx);
      })
    }
  }
}

function render() {
  renderBomb();
}

function mousedown(event) {
  createBomb(getPos(canvas,event))
}

// BOMB
function renderBomb() {
  if(bombs.length != 0) {
    bombs.forEach(function(item, index) {
      item.render(ctx);
    })
  }
}

function prime() {
  ba = 1;
  if(bombs.length != 0) {
    bombs.forEach(function(item, index) {
      item.prime();
    })
  }
  setTimeout(unprime,1000)
}

function unprime() {
  console.log("hi")
  ba = 0;
  if(bombs.length != 0) {
    nea = [];
    bombs.forEach(function(item, index) {
      if(item.pt == 0) {
        nea.push(item);
      } else {
        item.clear(ctx);
      }
    })
    bombs = nea;
  }
}

function createBomb(pos) {
  var bomb = new Bomb(pos.x,pos.y);
  bombs.push(bomb)
}
// INIT CODE
function startGameEngine() {
  update();
  render();
  setTimeout(startGameEngine, 100);
}
// EVENTS
canvas.addEventListener('mousedown',function(e){mousedown(event)});
prb.addEventListener('click', function(e){prime()});
// START
startGameEngine();
 
