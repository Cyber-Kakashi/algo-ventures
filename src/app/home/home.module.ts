import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MazeTraversalComponent } from './maze-traversal/maze-traversal.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [
    HomeComponent,
    MazeTraversalComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatGridListModule,
    HomeRoutingModule,
  ],
  providers: [],
  bootstrap: [HomeComponent],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
