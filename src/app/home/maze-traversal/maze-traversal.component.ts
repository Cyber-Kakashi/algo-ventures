import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
}
@Component({
  selector: 'app-maze-traversal',
  templateUrl: './maze-traversal.component.html',
  styleUrls: ['./maze-traversal.component.scss']
})
export class MazeTraversalComponent implements OnInit {
  columns: number = 50;
  rows: number = 35;
  tiles: Tile[] = [];
  startPoint: Tile;
  endPoint: Tile;
  constructor() { }

  ngOnInit(): void {
    let i = 0;
    let j = 0;
    for (i = 0; i < this.columns; i++) {
      for (j = 0; j < this.rows; j++) {
        this.tiles.push({
          cols: 1,
          rows: 1,
          color: 'gray'
        });
      }
    }
  }

}
