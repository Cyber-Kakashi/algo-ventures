import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  antSim(): void {
    this.router.navigate(['/home/ants']);
  }

  maze(): void {
    this.router.navigate(['/home/maze']);
  }

  life(): void {
    this.router.navigate(['/home/life']);
  }
  
  tree(): void {
    this.router.navigate(['/home/tree']);
  }



  
}
