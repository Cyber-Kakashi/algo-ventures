import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  x: number;
  y: number;
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
  rows = 70;
  tiles: Array<Array<Tile>> = [];
  list = [];
  startTile: Tile;
  endTile: Tile;
  constructor() { }

  ngOnInit(): void {
    let i = 0;
    let j = 0;
    for (i = 0; i < this.columns; i++) {
      for (j = 0; j < this.rows; j++) {
        this.list.push({
          cols: 1,
          rows: 1,
          color: Color.gray,
          y: i,
          x: j
        });
      }
      this.tiles.push(this.list);
      this.list = [];
    }
  }

  seTtartTile(tile: Tile): void {
    console.log(tile.x, tile.y);
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
    console.log('tate');
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
    console.log(this.tiles[this.startTile.y][this.startTile.x]);
  }
}
