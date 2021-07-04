import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FractalTreeComponent } from './fractal-tree.component';

describe('FractalTreeComponent', () => {
  let component: FractalTreeComponent;
  let fixture: ComponentFixture<FractalTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FractalTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FractalTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
