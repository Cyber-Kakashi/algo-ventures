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
  red = 'darkred'
}
@Component({
  selector: 'app-maze-traversal',
  templateUrl: './maze-traversal.component.html',
  styleUrls: ['./maze-traversal.component.scss']
})
export class MazeTraversalComponent implements OnInit {
  columns = 35;
  rows = 80;
  tiles: Array<Array<Tile>> = [];
  list = [];
  startTile: Tile;
  endTile: Tile;
  constructor() { }

  ngOnInit(): void {
    this.resetGrid();
  }

  resetGrid(): void {
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
  }

  seTtartTile(tile: Tile): void {
    console.log(tile);
    if (this.startTile?.x === tile.x && this.startTile?.y === tile.y) {
    } else {
      if (tile.color === Color.gray) {
        this.startTile ? this.startTile.color = Color.gray : console.log();
        tile.color = Color.green;
        this.startTile = tile;
      }
    }
  }

  setEndTile(tile: Tile, event): void {
    event.preventDefault();
    if (this.endTile?.x === tile.x && this.endTile?.y === tile.y) {
    } else {
      if (tile.color === Color.gray) {
        this.endTile ? this.endTile.color = Color.gray : console.log();
        tile.color = Color.red;
        this.endTile = tile;
      }
    }
  }

  startGame(): void {
    if (this.startTile && this.endTile) {
      this.drawMaze(this.startTile, this.endTile);
      this.startTile.color = Color.green;
      this.endTile.color = Color.red;
    }
  }

  drawMaze(startTile: Tile, end: Tile): void {
    this.depthFirstSearch(startTile);
  }

  depthFirstSearch(startTile: Tile, traverseDirection = ''): void  {
    if (startTile.color === Color.green || startTile.color === Color.gray || startTile.color === Color.red) {
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
      if (startTile.y + 1 < this.columns && this.checkTile(startTile.y + 1, startTile.x)) {
        startTile.btm = true;
        temp.push({
          x: startTile.x,
          y: startTile.y + 1,
          d: 'd'
        });
        // this.depthFirstSearch(this.tiles[startTile.y + 1][startTile.x], 'd');
      }
      if (startTile.x - 1 >= 0 && this.checkTile(startTile.y, startTile.x - 1)) {
        startTile.lft = true;
        temp.push({
          x: startTile.x - 1,
          y: startTile.y,
          d: 'l'
        });
        // this.depthFirstSearch(this.tiles[startTile.y][startTile.x - 1], 'l');
      }
      if (startTile.x + 1 < this.rows && this.checkTile(startTile.y, startTile.x + 1)) {
        startTile.rgt = true;
        temp.push({
          x: startTile.x + 1,
          y: startTile.y,
          d: 'r'
        });
        // this.depthFirstSearch(this.tiles[startTile.y][startTile.x + 1], 'r');
      }
      if (startTile.y - 1 >= 0 && this.checkTile(startTile.y - 1, startTile.x)) {
        startTile.top = true;
        temp.push({
          x: startTile.x,
          y: startTile.y - 1,
          d: 'u'
        });
        // this.depthFirstSearch(this.tiles[startTile.y - 1][startTile.x], 'u');
      }
      while (temp.length) {
        let indx = Math.random() * temp.length;
        indx = Math.round(indx);
        if (temp[indx]) {
          this.depthFirstSearch(this.tiles[temp[indx]?.y][temp[indx]?.x], temp[indx]?.d);
          temp.splice(indx, 1);
        }
      }
    }
  }

  checkTile(y: number, x: number): boolean {
    if (this.tiles[y][x].color === Color.gray || this.tiles[y][x].color === Color.red || this.tiles[y][x].color === Color.green) {
      return true;
    }
    return false;
  }
}
