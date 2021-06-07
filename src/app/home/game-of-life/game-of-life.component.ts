import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

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
export class GameOfLifeComponent implements OnInit, OnDestroy {

  columns = 35;
  rows = 80;
  tiles: Array<Array<Tile>> = [];
  newTiles: Array<Array<Tile>> = [];
  list = [];
  count = 0;
  speed = 60;
  generation = 1;
  population = 0;
  totalPopulation = 0;
  death = 0;
  birth = 0;
  intervalId: number;
  Math = Math;

  ngOnDestroy(): void {
    this.stopGame();
  }

  ngOnInit(): void {
    this.resetGrid();
  }

  randomGrid(): void {
    this.resetGrid(1);
  }

  // Remember that x => j and y => i
  resetGrid(randomize = 0): void {
    this.population = 0;
    this.tiles = [];
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.list.push(
          this.createNewTile(randomize ? Math.random() < 0.5 ? 0 : 1 : 0)
        );
      }
      this.tiles.push(this.list);
      this.list = [];
    }
    this.newTiles = undefined;
    this.death = 0;
    this.birth = 0;
    this.generation = 1;
    this.totalPopulation = this.population;
  }

  async startGame(): Promise<any> {
    this.generation = 1;
    this.totalPopulation = this.population;
    if (!this.intervalId) {
      console.log('Game started');
      this.intervalId = setInterval(() => {
        this.newTiles = this.deepCloneArray(this.tiles);
        for (let i = 0; i < this.columns; i++) {
          for (let j = 0; j < this.rows; j++) {
            if (!this.newTiles[i][j].val && this.totalNeighbors(i, j) === 3) {
              this.newTiles[i][j].val = 1;
              this.birth += 1;
              this.population += 1;
            }else if (this.newTiles[i][j].val && (this.totalNeighbors(i, j) > 3 || this.totalNeighbors(i, j) < 2)) {
              this.newTiles[i][j].val = 0;
              this.death += 1;
              this.population -= 1;
            }
          }
        }
        this.totalPopulation += this.population;
        this.generation += 1;
        this.tiles = this.deepCloneArray(this.newTiles);
      }, 0);
    }
  }

  stopGame(): void {
    console.log('Game stopped');
    clearInterval(this.intervalId);
    this.intervalId = null;
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
    if (val) { this.population += 1; }
    return {
      cols: 1,
      rows: 1,
      val,
    };
  }

  setGame(tile: Tile): void {
    if (tile.val) {
      this.population -= 1;
      tile.val = 0;
    } else {
      this.population += 1;
      tile.val = 1;
    }
  }

  async delay(ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
