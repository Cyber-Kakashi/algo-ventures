import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Tree } from './trees';

@Component({
  selector: 'app-fractal-tree',
  templateUrl: './fractal-tree.component.html',
  styleUrls: ['./fractal-tree.component.scss']
})
export class FractalTreeComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  tree: Tree[] = [];
  showHelp = true;
  delta = 1;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  async proceed(): Promise<any> {
    this.showHelp = false;
    await this.delay(10);
    this.initialize();
    this.ctx.canvas.width = (window.innerWidth * 96) / 100;
    this.ctx.canvas.height = (window.innerHeight * 96) / 100;
  }

  play(): void {
    this.delta = this.delta - 0.1;
    if (this.tree.length < 15) {
      console.log('ant created');
      const tree = new Tree(this.ctx, 70, this.delta, x, y);
      this.tree = this.tree.concat(tree);
    }
  }

  initialize(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ngZone.runOutsideAngular(() => this.tick());
    setInterval(() => {
      this.tick();
    }, 1);
  }

  tick(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.tree.forEach((tree: Tree) => {
      tree.draw();
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  onResize(): void {
    this.ctx.canvas.width = (window.innerWidth * 96) / 100;
    this.ctx.canvas.height = (window.innerHeight * 96) / 100;
  }

  async delay(ms): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
