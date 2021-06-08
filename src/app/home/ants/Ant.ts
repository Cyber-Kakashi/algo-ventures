interface Points {
  x: number;
  y: number;
  strength: number;
}
export class Ant {
  private HomeX = Math.round(window.innerWidth / 2 - 35);
  private HomeY = Math.round(window.innerHeight / 2 - 27);
  private color = 'red';
  x = this.HomeX;
  y = this.HomeY;
  private size = 3;
  private dx = this.randomInRange(-1, 1);
  private dy = this.randomInRange(-1, 1);
  private tdx;
  private tdy;
  private homePheramoneTrail: Array<Points> = [];
  private pheramoneDropRate = 10;
  private evaporationRate = 2;
  private count = 0;
  private homePath: Array<Points> = [];
  private food = false;

  constructor(private ctx: CanvasRenderingContext2D) {}

  antMotion(): void {
    if (!this.food) {
      this.draw();
      this.dx = this.randomizeMotion(this.dx);
      this.dy = this.randomizeMotion(this.dy);
      this.checkMotion();
      this.x += this.dx;
      this.y += this.dy;
      if (this.x > window.innerWidth - 65) {
        this.dx = -this.dx;
      } else if (this.x < 0) {
        this.dx = -this.dx;
      }
      if (this.y > window.innerHeight - 40) {
        this.dy = -this.dy;
      } else if (this.y < 0) {
        this.dy = -this.dy;
      }
    } else {
      // do something
    }
  }

  private draw(): void {
    if (!(this.count % this.pheramoneDropRate)) {
      this.homePheramoneTrail.push({
        x: this.x,
        y: this.y,
        strength: 255,
      });
      this.count = 1;
      for (let i = 0; i < this.homePheramoneTrail.length; i++) {
        if (this.homePheramoneTrail[i].strength >= 20) {
          this.ctx.fillStyle = `#4deaff${Number(
            this.homePheramoneTrail[i].strength
          ).toString(16)}`;
          this.homePheramoneTrail[i].strength -= this.evaporationRate;
          this.ctx.fillRect(
            this.homePheramoneTrail[i].x,
            this.homePheramoneTrail[i].y,
            3,
            3
          );
        } else {
          this.homePheramoneTrail.splice(i, 1);
        }
      }
    } else {
      for (let i = 0; i < this.homePheramoneTrail.length; i++) {
        if (this.homePheramoneTrail[i].strength >= 20) {
          this.ctx.fillStyle = `#4deaff${Number(
            this.homePheramoneTrail[i].strength
          ).toString(16)}`;
          this.ctx.fillRect(
            this.homePheramoneTrail[i].x,
            this.homePheramoneTrail[i].y,
            3,
            3
          );
        } else {
          this.homePheramoneTrail.splice(i, 1);
        }
      }
    }
    this.count++;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  randomizeMotion(d: number): number {
    const random = Math.round(Math.random() * 1000);
    if (random <= 10) {
      if (d === 1) {
        d = this.randomInRange(0, 1);
      } else if (d === -1) {
        d = this.randomInRange(-1, 0);
      } else if (d === 0) {
        this.randomInRange(0, 1000) % 2 ? (d = 1) : (d = -1);
      }
    }
    return d;
  }

  checkMotion(): void {
    if (this.dx || this.dy) {
    } else {
      this.randomInRange(0, 1000) % 2 ? (this.dx = 1) : (this.dx = -1);
      this.randomInRange(0, 1000) % 2 ? (this.dy = 1) : (this.dy = -1);
    }
  }

  randomInRange(min, max): number {
    const randomNumber = Math.round(Math.random() * (max - min) + min);
    if (!randomNumber) {
      return 0;
    }
    return randomNumber;
  }
}
