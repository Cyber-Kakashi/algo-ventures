import { NgModule } from '@angular/core';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MazeTraversalComponent } from './maze-traversal/maze-traversal.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    MazeTraversalComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    HomeRoutingModule
  ],
  providers: [],
  bootstrap: [HomeComponent],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
