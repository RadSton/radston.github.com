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
