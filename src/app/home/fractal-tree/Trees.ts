export class Tree {

  constructor() {
  }

  async draw(startX, startY, len, angle, branchWidth, ctx) {
    ctx.lineWidth = branchWidth;

    ctx.beginPath();
    ctx.save();

    ctx.strokeStyle = "green";
    ctx.fillStyle = "green";

    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI/180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,0,0,0.8)";

    if(len < 10) {
        ctx.restore();
        return;
    }

    await this.delay(10);

    await this.draw(0, -len, len*0.8, angle-15, branchWidth*0.8, ctx);
    await this.draw(0, -len, len*0.8, angle+15, branchWidth*0.8, ctx);

    ctx.restore();
  }

  async delay(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
}
