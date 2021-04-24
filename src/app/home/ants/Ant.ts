export class Ant {
  private color = 'red';
  private x = window.innerWidth / 2 - 35;
  private y = window.innerHeight / 2 - 27;
  private size = 3;
  private dx = this.randomInRange(-1, 1);
  private dy = this.randomInRange(-1, 1);
  private tdx;
  private tdy;

  constructor(private ctx: CanvasRenderingContext2D) {}

  antMotion(): void {
    this.dx = this.randomizeMotion(this.dx);
    this.dy = this.randomizeMotion(this.dy);
    this.checkMotion();
    this.x += this.dx;
    this.y += this.dy;
    if (this.x > window.innerWidth - 70) {
      this.dx = -this.dx;
    }
    if (this.y > window.innerHeight - 55) {
      this.dy = -this.dy;
    }
    if (this.x < 0) {
      this.dx = -this.dx;
    }
    if (this.y < 0) {
      this.dy = -this.dy;
    }
    this.draw();
  }

  private draw(): void {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  randomizeMotion(d: number): number {
    const random = Math.round(Math.random() * 1000);
    if (random <= 10) {
      if (d === 1) {
        d = this.randomInRange(-1, 0);
      } else if (d === -1) {
        d = this.randomInRange(0, 1);
      } else {
        this.randomInRange(0, 1000) % 2 ? (d = 1) : (d = -1);
      }
    }
    return d;
  }

  checkMotion(): void {
    if (this.dx || this.dy) {
      this.tdx = this.dx;
      this.tdy = this.dy;
    } else {
      this.dx = this.tdx;
      this.dy = this.tdy;
    }
  }

  randomInRange(min, max): number {
    const randomNumber = Math.round(Math.random() * (max - min) + min);
    return randomNumber;
  }
}
