export class Tree {
  private color = 'red';
  x1 = 300;
  y1 = 300;
  length = 100;
  x2;
  x3;
  x4;
  y2;
  y3;
  y4;
  angle;


  constructor(private ctx: CanvasRenderingContext2D, angle: number, delta: number) {
    this.angle = angle;
    this.length = this.length * delta;

    this.x2 = this.x1 + Math.cos(Math.PI * this.angle / 180) * this.length;
    this.y2 = this.y1 + Math.sin(Math.PI * this.angle / 180) * this.length;

    this.x3 = this.x1 + Math.cos(Math.PI * (this.angle + 120) / 180) * this.length;
    this.y3 = this.y1 + Math.sin(Math.PI * (this.angle + 120) / 180) * this.length;

    this.x4 = this.x1 + Math.cos(Math.PI * (this.angle - 120) / 180) * this.length;
    this.y4 = this.y1 + Math.sin(Math.PI * (this.angle - 120) / 180) * this.length;
  }

  draw(): void {
    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x2, this.y2);

    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x3, this.y3);

    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x4, this.y4);

    this.ctx.stroke();
  }
}
