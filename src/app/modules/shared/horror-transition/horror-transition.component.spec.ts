import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorrorTransitionComponent } from './horror-transition.component';

describe('HorrorTransitionComponent', () => {
  let component: HorrorTransitionComponent;
  let fixture: ComponentFixture<HorrorTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorrorTransitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorrorTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
