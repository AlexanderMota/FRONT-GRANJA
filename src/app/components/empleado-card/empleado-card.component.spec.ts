import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoCardComponent } from './empleado-card.component';

describe('EmpleadoCardComponent', () => {
  let component: EmpleadoCardComponent;
  let fixture: ComponentFixture<EmpleadoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
