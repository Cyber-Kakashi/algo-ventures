import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

export interface Tile {
  cols: number;
  rows: number;
  val: number;
}

export enum Status {
  initialized = -1,
  visited = -9,
}

export enum Color {
  white = 'white',
  black = 'gray',
}

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.scss']
})
export class GameOfLifeComponent implements OnInit {

  columns = 35;
  rows = 80;
  tiles: Array<Array<Tile>> = [];
  newTiles: Array<Array<Tile>> = [];
  list = [];
  count = 0;
  speed = 60;
  generation = 0;
  run = true;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.resetGrid();
  }

  // Remember that x => j and y => i
  resetGrid(): void {
    this.tiles = [];
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.list.push(
          this.createNewTile(0)
        );
      }
      this.tiles.push(this.list);
      this.list = [];
    }
    this.newTiles = undefined;
  }

  async startGame(): Promise<any> {
    this.generation = 0;
    while (this.generation < 100) {
      this.newTiles = this.deepCloneArray(this.tiles);
      for (let i = 0; i < this.columns; i++) {
        for (let j = 0; j < this.rows; j++) {
          if (!this.newTiles[i][j].val && this.totalNeighbors(i, j) === 3) {
            this.newTiles[i][j].val = 1;
          }else if (this.newTiles[i][j].val && (this.totalNeighbors(i, j) > 3 || this.totalNeighbors(i, j) < 2)) {
            this.newTiles[i][j].val = 0;
          }
        }
      }
      this.generation += 1;
      await this.delay(0);
      this.tiles = this.deepCloneArray(this.newTiles);
    }
  }


  totalNeighbors(x: number, y: number): number {
    let nbrs = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1 ; j++) {
        if (this.tiles[(x + i + this.columns) % this.columns][(y + j + this.rows) % this.rows].val) {
          nbrs += 1;
        }
      }
    }
    if (this.tiles[x][y].val) {
      nbrs -= 1;
    }
    return nbrs;
  }

  deepCloneArray(array: Array<Array<Tile>>): Array<Array<Tile>> {
    return array.map((x) => {
      let list: Array<Tile>;
      list = x.map((y) => Object.assign({}, y));
      return list;
    });
  }

  createNewTile(val): Tile {
    return {
      cols: 1,
      rows: 1,
      val,
    };
  }

  setGame(tile: Tile): void {
    tile.val = 1;
  }

  async delay(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
