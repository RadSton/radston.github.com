class Bomb {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.pt = 0;
  }
  render(ctx) {
    if(this.pt == 0) {
      drawBomb(this.x,this.y,ctx)
    }
    if(this.pt == 1) {
        drawBombExplusion(this.x,this.y,ctx)
    }
  }


  clear(ctx) {
    ctx.clearRect(this.x -(128/2), this.y - (120/2), 150, 150);
  }
  prime() {
    this.pt = 1;
  }
}
