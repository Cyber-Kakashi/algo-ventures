import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  dist: number;
  x: number;
  y: number;
  top: boolean;
  btm: boolean;
  rgt: boolean;
  lft: boolean;
  text: string;
}

export enum Color {
  white = 'white',
  gray = 'gray',
  green = 'green',
  red = 'darkred',
  lightgreen = '#c5f0c5',
  lighblue = 'lightblue',
  lightviolet= '#ddbdf1',
  lightpink= 'lightpink',
}
@Component({
  selector: 'app-maze-traversal',
  templateUrl: './maze-traversal.component.html',
  styleUrls: ['./maze-traversal.component.scss'],
})
export class MazeTraversalComponent implements OnInit {
  columns = 35;
  rows = 80;
  tiles: Array<Array<Tile>> = [];
  list = [];
  startTile: Tile;
  endTile: Tile;
  count = 0;
  speed = 10;
  maxDist: number;
  inProcess = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.resetGrid();
  }

  processStart(): void {
    this.inProcess = true;
  }

  processEnd(): void {
    this.inProcess = false;
  }

  resetGrid(): void {
    this.processStart();
    let i = 0;
    let j = 0;
    this.tiles = [];
    for (i = 0; i < this.columns; i++) {
      for (j = 0; j < this.rows; j++) {
        this.list.push({
          cols: 1,
          rows: 1,
          color: Color.gray,
          y: i,
          x: j,
          dist: -1,
          top: 0,
          btm: 0,
          rgt: 0,
          lft: 0,
          text: '',
        });
      }
      this.tiles.push(this.list);
      this.list = [];
    }
    this.startTile = this.tiles[0][0];
    this.endTile = this.tiles[this.columns - 1][this.rows - 1];
    this.maxDist = undefined;
    this.processEnd();
  }

  seTtartTile(tile: Tile): void {
    console.log(tile);
    if (this.startTile?.x === tile.x && this.startTile?.y === tile.y) {
    } else {
      if (tile.color === Color.gray && !this.inProcess) {
        this.startTile = tile;
      }
    }
  }

  setEndTile(tile: Tile, event): void {
    event.preventDefault();
    if (this.endTile?.x === tile.x && this.endTile?.y === tile.y) {
    } else {
      if (tile.color === Color.gray && !this.inProcess) {
        this.endTile = tile;
      }
    }
  }

  async startGame(): Promise<any> {
    if (!this.inProcess) {
      this.processStart();
      if (this.startTile && this.endTile) {
        await this.drawMaze(this.startTile);
        await this.calculateDistance(this.endTile);
        console.log(this.maxDist);
        this.startTile.color = Color.green;
        this.endTile.color = Color.red;
      }
      this.processEnd();
    }
  }

  async drawMaze(startTile: Tile): Promise<any> {
    await this.depthFirstSearch(startTile);
  }

  async calculateDistance(endTile: Tile): Promise<any> {
    await this.assignDistance(endTile, 0);
  }

  async assignDistance(endTile: Tile, dist: number): Promise<any> {
    if (endTile.dist === -1) {
      if (!(++this.count % this.speed)) {
        const prms = await this.delay(0);
        this.count = 1;
      }
      endTile.dist = dist;
      this.maxDist = this.maxDist ? Math.max(this.maxDist, dist) : dist;
      if (
        endTile.top &&
        endTile.y - 1 >= 0 &&
        this.tiles[endTile.y - 1][endTile.x].dist === -1 &&
        this.tiles[endTile.y - 1][endTile.x].btm
      ) {
        await this.assignDistance(this.tiles[endTile.y - 1][endTile.x], dist + 1);
      }
      if (
        endTile.rgt &&
        endTile.x + 1 < this.rows &&
        this.tiles[endTile.y][endTile.x + 1].dist === -1 &&
        this.tiles[endTile.y][endTile.x + 1].lft
      ) {
        await this.assignDistance(this.tiles[endTile.y][endTile.x + 1], dist + 1);
      }
      if (
        endTile.btm &&
        endTile.y + 1 < this.columns &&
        this.tiles[endTile.y + 1][endTile.x].dist === -1 &&
        this.tiles[endTile.y + 1][endTile.x].top
      ) {
        await this.assignDistance(this.tiles[endTile.y + 1][endTile.x], dist + 1);
      }
      if (
        endTile.lft &&
        endTile.x - 1 >= 0 &&
        this.tiles[endTile.y][endTile.x - 1].dist === -1 &&
        this.tiles[endTile.y][endTile.x - 1].rgt
      ) {
        await this.assignDistance(this.tiles[endTile.y][endTile.x - 1], dist + 1);
      }
    }
  }

  async depthFirstSearch(
    startTile: Tile,
    traverseDirection = ''
  ): Promise<any> {
    if (startTile.color !== Color.white) {
      const temp = [];
      startTile.color = Color.white;
      if (traverseDirection.length) {
        if (traverseDirection === 'u') {
          startTile.btm = true;
        } else if (traverseDirection === 'd') {
          startTile.top = true;
        } else if (traverseDirection === 'r') {
          startTile.lft = true;
        } else if (traverseDirection === 'l') {
          startTile.rgt = true;
        }
      }
      if (
        startTile.y + 1 < this.columns &&
        this.checkTile(startTile.y + 1, startTile.x)
      ) {
        startTile.btm = true;
        temp.push({
          x: startTile.x,
          y: startTile.y + 1,
          d: 'd',
        });
      }
      if (
        startTile.x - 1 >= 0 &&
        this.checkTile(startTile.y, startTile.x - 1)
      ) {
        startTile.lft = true;
        temp.push({
          x: startTile.x - 1,
          y: startTile.y,
          d: 'l',
        });
      }
      if (
        startTile.x + 1 < this.rows &&
        this.checkTile(startTile.y, startTile.x + 1)
      ) {
        startTile.rgt = true;
        temp.push({
          x: startTile.x + 1,
          y: startTile.y,
          d: 'r',
        });
      }
      if (
        startTile.y - 1 >= 0 &&
        this.checkTile(startTile.y - 1, startTile.x)
      ) {
        startTile.top = true;
        temp.push({
          x: startTile.x,
          y: startTile.y - 1,
          d: 'u',
        });
      }
      if (!(++this.count % this.speed)) {
        const prms = await this.delay(0);
        this.count = 1;
      }
      while (temp.length) {
        let indx = Math.random() * temp.length;
        indx = Math.round(indx);
        if (temp[indx]) {
          await this.depthFirstSearch(
            this.tiles[temp[indx]?.y][temp[indx]?.x],
            temp[indx]?.d
          );
          temp.splice(indx, 1);
        }
      }
    }
  }

  checkTile(y: number, x: number): boolean {
    if (this.tiles[y][x].color !== Color.white) {
      return true;
    }
    return false;
  }

  setColor(tile: Tile): string {
    if (tile.dist >= 0) {
      if (tile.dist < (this.maxDist / 4)) {
        return Color.lightgreen;
      } else if (tile.dist >= (this.maxDist / 4) && tile.dist < (this.maxDist / 2)) {
        return Color.lighblue;
      } else if (tile.dist >= (this.maxDist / 2) && tile.dist < ((this.maxDist * 3) / 4)) {
        return Color.lightviolet;
      } else if (tile.dist >= ((this.maxDist * 3) / 4)){
        return Color.lightpink;
      }
    } else {
      if (tile.dist === -1) {
        return Color.gray;
      }
    }
  }

  async delay(ms): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
