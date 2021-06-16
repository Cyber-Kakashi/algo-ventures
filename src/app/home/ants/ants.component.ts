import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Ant } from './Ant';

@Component({
  selector: 'app-ants',
  templateUrl: './ants.component.html',
  styleUrls: ['./ants.component.scss'],
})
export class AntsComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  ants: Ant[] = [];
  showHelp = true;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  async proceed(): Promise<any> {
    this.showHelp = false;
    await this.delay(10);
    this.initialize();
    this.ctx.canvas.width = (window.innerWidth * 96) / 100;
    this.ctx.canvas.height = (window.innerHeight * 96) / 100;
  }

  initialize(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ngZone.runOutsideAngular(() => this.tick());
    setInterval(() => {
      this.tick();
    }, 1);
  }

  tick(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ants.forEach((ant: Ant) => {
      ant.antMotion();
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  play(): void {
    if (this.ants.length < 15) {
      console.log('ant created');
      const ant = new Ant(this.ctx);
      this.ants = this.ants.concat(ant);
    }
  }

  gameOver(event): void {
    event.preventDefault();
    this.ants = [];
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  onResize(): void {
    this.ctx.canvas.width = (window.innerWidth * 96) / 100;
    this.ctx.canvas.height = (window.innerHeight * 96) / 100;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  async delay(ms): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
