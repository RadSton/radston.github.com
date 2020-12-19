function getObject(name) {
  return document.querySelector(name);
}
function log(log) {
  console.log("[GAME] " + log)
}

function getPos(canvas,event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return {x,y};
}
function generateRandomPos() {
  const x = Math.floor(Math.random() * 1001);
  const y = Math.floor(Math.random() * 1001);
  return {x,y};
}
function updateGameEngine() {
  windowsize = [window.innerWidth, window.innerHeight];
  canvas.width = windowsize[0] - 201;
  canvas.height = windowsize[1] - 230;
}

function openMenue() {
  if(getObject(".menuoverlay").style.display == "")
    getObject(".menuoverlay").style.display = "none"

  if(getObject(".menuoverlay").style.display == "none") {
    getObject(".menuoverlay").style.display = "flex"
  } else {
    getObject(".menuoverlay").style.display = "none"
  }
}
