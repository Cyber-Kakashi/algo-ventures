import { Component, OnInit } from '@angular/core';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  x: number;
  y: number;
  top: boolean;
  btm: boolean;
  rgt: boolean;
  lft: boolean;
}

export enum Color {
  white = 'white',
  gray = 'gray',
  green = 'green',
  red = 'darkred',
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
  inProcess = false;
  constructor() {}

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
          top: 0,
          btm: 0,
          rgt: 0,
          lft: 0,
        });
      }
      this.tiles.push(this.list);
      this.list = [];
    }
    this.startTile = undefined;
    this.endTile = undefined;
    this.processEnd();
  }

  seTtartTile(tile: Tile): void {
    if (this.startTile?.x === tile.x && this.startTile?.y === tile.y) {
    } else {
      if (tile.color === Color.gray  && !this.inProcess) {
        this.startTile ? (this.startTile.color = Color.gray) : console.log();
        tile.color = Color.green;
        this.startTile = tile;
      }
    }
  }

  setEndTile(tile: Tile, event): void {
    event.preventDefault();
    if (this.endTile?.x === tile.x && this.endTile?.y === tile.y) {
    } else {
      if (tile.color === Color.gray && !this.inProcess) {
        this.endTile ? (this.endTile.color = Color.gray) : console.log();
        tile.color = Color.red;
        this.endTile = tile;
      }
    }
  }

  async startGame(): Promise<any> {
    if (!this.inProcess) {
      this.processStart();
      if (this.startTile && this.endTile) {
        await this.drawMaze(this.startTile, this.endTile);
        this.startTile.color = Color.green;
        this.endTile.color = Color.red;
      }
      this.processEnd();
    }
  }

  async drawMaze(startTile: Tile, end: Tile): Promise<any> {
    await this.depthFirstSearch(startTile);
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

  async delay(ms): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
