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
export class AntsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  ants: Ant[] = [];
  screenX: number;
  screenY: number;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ngZone.runOutsideAngular(() => this.tick());
    setInterval(() => {
      this.tick();
    }, 22);
  }
  ngAfterViewInit(): void {
    this.ctx.canvas.width = (window.innerWidth * 96) / 100;
    this.ctx.canvas.height = (window.innerHeight * 96) / 100;
  }

  tick(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ants.forEach((ant: Ant) => {
      ant.antMotion();
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  play(event: MouseEvent): void {
    this.screenX = event.screenX;
    this.screenY = event.screenY;
    for (let i = 0; i < 100; i++) {
      const ant = new Ant(this.ctx);
      this.ants = this.ants.concat(ant);
    }
  }

  gameOver(event): void {
    event.preventDefault();
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }
}
