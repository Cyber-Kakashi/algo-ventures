import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Tree } from './Trees';

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
  tree: Tree;
  showHelp = true;
  delta = 1;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}


  play(): void {
    this.delta = this.delta - 0.1;
    console.log('ant created');
    const tree = new Tree();
    tree.draw(400, 600, 120, 0, 10, this.ctx);
  
  }

  async proceed(): Promise<any> {
    this.showHelp = false;
    await this.delay(10);
    this.initialize();
    this.ctx.canvas.width = (window.innerWidth * 96) / 100;
    this.ctx.canvas.height = (window.innerHeight * 96) / 100;
  }

  initialize(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  onResize(): void {
    this.ctx.canvas.width = (window.innerWidth * 96) / 100;
    this.ctx.canvas.height = (window.innerHeight * 96) / 100;
  }

  async delay(ms): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
