import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
export interface Tile {
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

export enum Status {
  initialized = -1,
  visited = -9,
}

export enum Color {
  white = 'white',
  gray = 'gray',
  green = 'green',
  red = 'darkred',
  lightgreen = '#c5f0c5',
  lighblue = 'lightblue',
  lightviolet = '#ddbdf1',
  lightpink = 'lightpink',
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
  mazeTiles: Array<Array<Tile>> = [];
  distanceTiles: Array<Array<Tile>> = [];
  list = [];
  startTile: Tile;
  endTile: Tile;
  count = 0;
  speed = 60;
  maxDist: number;
  statisticsTile: Tile;
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

  async setStartTile(tile: Tile): Promise<any> {
    if (tile.x !== this.endTile.x || tile.y !== this.endTile.y) {
      this.startTile = tile;
      if (this.distanceTiles?.length) {
        this.startTile = this.newTile(
          tile.x,
          tile.y,
          this.distanceTiles[tile.y][tile.x].dist,
          tile.top,
          tile.btm,
          tile.rgt,
          tile.lft
        );
        this.processStart();
        this.tiles = this.deepCloneArray(this.distanceTiles);
        await this.drawPath(this.startTile);
        this.processEnd();
      }
    }
  }

  async setEndTile(tile: Tile, event): Promise<any> {
    event.preventDefault();
    if (this.startTile?.x !== tile.x || this.startTile?.y !== tile.y) {
      this.endTile = tile;
      if (this.mazeTiles?.length) {
        this.endTile = this.newTile(
          tile.x,
          tile.y,
          Status.visited,
          tile.top,
          tile.btm,
          tile.rgt,
          tile.lft
        );
        this.processStart();
        this.tiles = this.deepCloneArray(this.mazeTiles);
        await this.calculateDistance(this.endTile);
        this.distanceTiles = this.deepCloneArray(this.tiles);
        this.startTile = this.newTile(
          this.startTile.x,
          this.startTile.y,
          this.distanceTiles[this.startTile.y][this.startTile.x].dist,
          this.startTile.top,
          this.startTile.btm,
          this.startTile.rgt,
          this.startTile.lft
        );
        await this.drawPath(this.startTile);
        this.processEnd();
      }
    }
  }

  async startGame(): Promise<any> {
    if (!this.inProcess) {
      this.processStart();
      if (this.startTile && this.endTile) {
        await this.drawMaze(this.startTile);
        this.mazeTiles = this.deepCloneArray(this.tiles);
        await this.calculateDistance(this.endTile);
        this.distanceTiles = this.deepCloneArray(this.tiles);
        await this.drawPath(this.startTile);
      }
      this.processEnd();
    }
  }

  // Remember that x => j and y => i
  resetGrid(): void {
    this.processStart();
    let i = 0;
    let j = 0;
    this.tiles = [];
    for (i = 0; i < this.columns; i++) {
      for (j = 0; j < this.rows; j++) {
        this.list.push(
          this.newTile(j, i, Status.initialized, false, false, false, false, '')
        );
      }
      this.tiles.push(this.list);
      this.list = [];
    }
    this.mazeTiles = undefined;
    this.distanceTiles = undefined;
    this.startTile = this.tiles[0][0];
    this.endTile = this.tiles[this.columns - 1][this.rows - 1];
    this.maxDist = undefined;
    this.processEnd();
  }

  async drawMaze(startTile: Tile): Promise<any> {
    await this.depthFirstSearch(startTile);
  }

  async calculateDistance(endTile: Tile): Promise<any> {
    await this.assignDistance(endTile, 0);
  }

  async depthFirstSearch(
    startTile: Tile,
    traverseDirection = ''
  ): Promise<any> {
    if (startTile.dist !== Status.visited) {
      const temp = [];
      startTile.dist = Status.visited;
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

  async assignDistance(endTile: Tile, dist: number): Promise<any> {
    if (endTile.dist === Status.visited) {
      if (!(++this.count % this.speed)) {
        const prms = await this.delay(0);
        this.count = 1;
      }
      endTile.dist = dist;
      this.maxDist = this.maxDist ? Math.max(this.maxDist, dist) : dist;
      if (
        endTile.top &&
        endTile.y - 1 >= 0 &&
        this.tiles[endTile.y - 1][endTile.x].dist === Status.visited &&
        this.tiles[endTile.y - 1][endTile.x].btm
      ) {
        await this.assignDistance(
          this.tiles[endTile.y - 1][endTile.x],
          dist + 1
        );
      }
      if (
        endTile.rgt &&
        endTile.x + 1 < this.rows &&
        this.tiles[endTile.y][endTile.x + 1].dist === Status.visited &&
        this.tiles[endTile.y][endTile.x + 1].lft
      ) {
        await this.assignDistance(
          this.tiles[endTile.y][endTile.x + 1],
          dist + 1
        );
      }
      if (
        endTile.btm &&
        endTile.y + 1 < this.columns &&
        this.tiles[endTile.y + 1][endTile.x].dist === Status.visited &&
        this.tiles[endTile.y + 1][endTile.x].top
      ) {
        await this.assignDistance(
          this.tiles[endTile.y + 1][endTile.x],
          dist + 1
        );
      }
      if (
        endTile.lft &&
        endTile.x - 1 >= 0 &&
        this.tiles[endTile.y][endTile.x - 1].dist === Status.visited &&
        this.tiles[endTile.y][endTile.x - 1].rgt
      ) {
        await this.assignDistance(
          this.tiles[endTile.y][endTile.x - 1],
          dist + 1
        );
      }
    }
  }

  async drawPath(startTile: Tile): Promise<any> {
    let tempTile: Tile;
    let minTileDist = startTile.dist;
    startTile.dist = Status.visited;
    if (!(++this.count % this.speed)) {
      await this.delay(0);
      this.count = 1;
    }
    if (
      startTile.top &&
      startTile.y - 1 >= 0 &&
      this.tiles[startTile.y - 1][startTile.x].dist >= 0 &&
      this.tiles[startTile.y - 1][startTile.x].btm
    ) {
      if (minTileDist > this.tiles[startTile.y - 1][startTile.x].dist) {
        minTileDist = this.tiles[startTile.y - 1][startTile.x].dist;
        tempTile = this.tiles[startTile.y - 1][startTile.x];
      }
    }
    if (
      startTile.rgt &&
      startTile.x + 1 < this.rows &&
      this.tiles[startTile.y][startTile.x + 1].dist >= 0 &&
      this.tiles[startTile.y][startTile.x + 1].lft
    ) {
      if (minTileDist > this.tiles[startTile.y][startTile.x + 1].dist) {
        minTileDist = this.tiles[startTile.y][startTile.x + 1].dist;
        tempTile = this.tiles[startTile.y][startTile.x + 1];
      }
    }
    if (
      startTile.btm &&
      startTile.y + 1 < this.columns &&
      this.tiles[startTile.y + 1][startTile.x].dist >= 0 &&
      this.tiles[startTile.y + 1][startTile.x].top
    ) {
      if (minTileDist > this.tiles[startTile.y + 1][startTile.x].dist) {
        minTileDist = this.tiles[startTile.y + 1][startTile.x].dist;
        tempTile = this.tiles[startTile.y + 1][startTile.x];
      }
    }
    if (
      startTile.lft &&
      startTile.x - 1 >= 0 &&
      this.tiles[startTile.y][startTile.x - 1].dist >= 0 &&
      this.tiles[startTile.y][startTile.x - 1].rgt
    ) {
      if (minTileDist > this.tiles[startTile.y][startTile.x - 1].dist) {
        minTileDist = this.tiles[startTile.y][startTile.x - 1].dist;
        tempTile = this.tiles[startTile.y][startTile.x - 1];
      }
    }
    if (
      tempTile &&
      (tempTile.x !== this.endTile.x || tempTile.y !== this.endTile.y)
    ) {
      await this.drawPath(tempTile);
    }
  }

  checkTile(y: number, x: number): boolean {
    if (this.tiles[y][x].dist !== Status.visited) {
      return true;
    }
    return false;
  }

  setColor(tile: Tile): string {
    if (tile.x === this.startTile?.x && tile.y === this.startTile?.y) {
      return Color.green;
    }
    if (tile.x === this.endTile?.x && tile.y === this.endTile?.y) {
      return Color.red;
    }
    if (tile.dist >= 0) {
      if (tile.dist < this.maxDist / 4) {
        return Color.lightgreen;
      } else if (
        tile.dist >= this.maxDist / 4 &&
        tile.dist < this.maxDist / 2
      ) {
        return Color.lighblue;
      } else if (
        tile.dist >= this.maxDist / 2 &&
        tile.dist < (this.maxDist * 3) / 4
      ) {
        return Color.lightviolet;
      } else if (tile.dist >= (this.maxDist * 3) / 4) {
        return Color.lightpink;
      }
    } else {
      if (tile.dist === Status.initialized) {
        return Color.gray;
      } else if (tile.dist === Status.visited) {
        return Color.white;
      }
    }
  }

  deepCloneArray(array: Array<Array<Tile>>): Array<Array<Tile>> {
    return array.map((x) => {
      let list: Array<Tile>;
      list = x.map((y) => Object.assign({}, y));
      return list;
    });
  }

  newTile(
    x: number,
    y: number,
    dist: number,
    top = false,
    btm = false,
    rgt = false,
    lft = false,
    text = ''
  ): Tile {
    return {
      cols: 1,
      rows: 1,
      y,
      x,
      dist,
      top,
      btm,
      rgt,
      lft,
      text,
    };
  }

  async delay(ms): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
