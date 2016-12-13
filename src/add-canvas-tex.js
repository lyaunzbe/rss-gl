
export default class {

  constructor () {
    this.canvas, this.ctx;
    this.lineWidth = 0.5;
    this.hue = Math.random()*360;
    this.offset = 100;
    this.saturation = 100;
    this.lightness = 50;
    this.alpha = 1.0;
    this.colors = [];
  }

  init () {
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  update () {
    this.hue += 0.5;
    this.sampleColors();
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < this.canvas.width; i++) {
        this.draw(i*2, this.centerX, this.centerY);
    }
  }

  draw (radius, x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.lineWidth = this.lineWidth;

    this.gradient = this.ctx.createRadialGradient(0,0,radius,0,0, radius*4);
    this.gradient.addColorStop(0, this.colors[0]);

    this.gradient.addColorStop(1.0, this.colors[1]);

    this.ctx.strokeStyle = this.gradient;
    this.ctx.stroke();
  }

  sampleColors () {
      this.colors[0] = this.hslaColor(this.hue, this.saturation, this.lightness, this.alpha)
      this.colors[1] = this.hslaColor(this.hue + this.offset, this.saturation, this.lightness, this.alpha)
  }

  hslaColor (h, s, l, a) {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }
}
