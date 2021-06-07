import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MazeTraversalComponent } from './maze-traversal/maze-traversal.component';
import { AntsComponent } from './ants/ants.component';
import { GameOfLifeComponent } from './game-of-life/game-of-life.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'maze' },
      {
        path: 'maze',
        component: MazeTraversalComponent,
      },
      {
        path: 'ants',
        component: AntsComponent,
      },
      {
        path: 'life',
        component: GameOfLifeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
