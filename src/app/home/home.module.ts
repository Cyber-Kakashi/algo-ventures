import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MazeTraversalComponent } from './maze-traversal/maze-traversal.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { AntsComponent } from './ants/ants.component';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';

@NgModule({
  declarations: [HomeComponent, MazeTraversalComponent, AntsComponent, GameOfLifeComponent],
  imports: [
    CommonModule,
    MatSliderModule,
    MatSidenavModule,
    MatGridListModule,
    HomeRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
