import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeTraversalComponent } from './maze-traversal.component';

describe('MazeTraversalComponent', () => {
  let component: MazeTraversalComponent;
  let fixture: ComponentFixture<MazeTraversalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MazeTraversalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeTraversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
