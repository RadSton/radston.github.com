class Bomb {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.pt = 0;
  }
  render(ctx) {
    if(this.pt == 0) {
      var img = new Image();
      var i = this.x;
      var j = this.y;
      img.onload = function(){
          ctx.drawImage(img,i - (128/2),j - (134/2));
      };
      img.src = "bomb.png";
    }
    if(this.pt == 1) {
        var img = new Image();
        var i = this.x;
        var j = this.y;
        img.onload = function(){
            ctx.drawImage(img,i - (128/2),j - (134/2));
        };
        img.src = "bomb2.png";
    }
  }


  clear(ctx) {
    ctx.clearRect(this.x -(128/2), this.y - (120/2), 150, 150);
  }
  prime() {
    this.pt = 1;
  }
}
