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
var primedNuc = 0;
var windowsize = [window.innerWidth, window.innerHeight];
var fps = Math.round((1/20)*1000) - 1
var demo = [];
var ignoreselec = false;
var renderselected = false;
// CODE

// RENDERER
function render() {
  if(bombtype == false && !renderselected) {
    if(ignoreselec) renderNuclearBomb();
    renderBomb();
  } else if(bombtype == true && !renderselected) {
    if(ignoreselec) renderBomb();
    renderNuclearBomb();
  } else {
    renderBomb();
    renderNuclearBomb();
  }
}

//UPDATEING AND EVENTMANAGMENT

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
  if(primedNuc == 1 || nuclearbombs.length == 0) return;
  primedNuc = 1;
  nuclearbombs[0].pt = 1;
  setTimeout(unprimenuclear,2000);
}
function unprimenuclear() {
  primedNuc = 0;
  nuclearbombs = [];
}
function createNuclearBomb(pos) {
  var nuclear = new Nuclearbomb(pos.x,pos.y);
  nuclearbombs.push(nuclear);
}
function primeSelectedBombs() {
  if (bombtype == false) {
    primeBombs();
  } else if(bombtype == true) {
    primeNuclear();
  } else {
    console.error("Could not prime Bombs!")
  }
}

// SETTINGS

function actdemo(mode) {
  if(demo[0] == null){
    demo[0] = 0;
    demo[1] = 1;
  }
  if(mode == 1){
    if(demo[0] == 0) {
      startDemo(1)
      getObject(".option5").style.background = "#02b302";
      demo[0] = 1;
      return;
    } else {
      startDemo(3)
      getObject(".option5").style.background = "white";
      demo[0] = 0;
      return;
    }
  } else if (mode == 2) {
    if(demo[1] == 0) {
      startDemo(2)
      getObject(".option6").style.background = "#02b302";
      demo[1] = 1;
      return;
    } else {
      startDemo(4)
      getObject(".option6").style.background = "white";
      demo[1] = 0;
      return;
    }
  }
}

function startDemo(mode) {
  if (mode == 1) {
    demo[2] = setInterval(() => {createBomb(generateRandomPos())},10)
  } else if(mode == 2) {
    demo[3] = setInterval(() => {createNuclearBomb(generateRandomPos())},10)
  } else if(mode == 3) {
    clearInterval(demo[2]);
    demo[2] = null;
  } else if(mode ==4) {
    clearInterval(demo[3]);
    demo[3] = null;
  } else {
    console.error("invalid param 124:20");
  }

}

function setRenderSettings(mode) {
  switch (mode) {
    case 1:
      getObject(".option9").style.background = "#02b302";
      getObject(".option11").style.background = "white";
      getObject(".option8").style.background = "white";
      ignoreselec = false;
      renderselected = false; // IF TRUE renders not selected
      break;
    case 2:
    //comming soon
      break;
    case 3:
      getObject(".option9").style.background = "white";
      getObject(".option11").style.background = "white";
      getObject(".option8").style.background = "#02b302";
      ignoreselec = true;
      renderselected = false;
      break;
    case 4:
      getObject(".option9").style.background = "white";
      getObject(".option8").style.background = "white";
      getObject(".option11").style.background = "#02b302";
      ignoreselec = true;
      renderselected = true;
      break;
    default:
      console.error();
  }
}

// STARTCODE

function startGameEngine() {
  render();
  setTimeout(startGameEngine, fps);
}

// EVENTS
function initEvents() {
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
  getObject(".option4").addEventListener("click", () => {updateGameEngine();})
  getObject(".option5").addEventListener("click",() => {actdemo(1)});
  getObject(".option6").addEventListener("click",() => {actdemo(2)});
  getObject(".option7").addEventListener("click",() => {primeBombs(); primeNuclear();});
  getObject(".option9").addEventListener("click",() => {setRenderSettings(1)})
  getObject(".option10") // comming soon
  getObject(".option8").addEventListener("click",() => {setRenderSettings(3)})
  getObject(".option11").addEventListener("click",() => {setRenderSettings(4)})
}


// INIT
initEvents();
getObject(".menuoverlay").style.display = "none";
updateGameEngine();


// START GAME
startGameEngine();
