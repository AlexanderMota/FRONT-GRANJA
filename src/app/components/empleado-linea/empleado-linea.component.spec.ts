import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoLineaComponent } from './empleado-linea.component';

describe('EmpleadoLineaComponent', () => {
  let component: EmpleadoLineaComponent;
  let fixture: ComponentFixture<EmpleadoLineaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpleadoLineaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
