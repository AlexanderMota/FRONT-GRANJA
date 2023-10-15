import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPrueba2Component } from './grafico-prueba2.component';

describe('GraficoPrueba2Component', () => {
  let component: GraficoPrueba2Component;
  let fixture: ComponentFixture<GraficoPrueba2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoPrueba2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoPrueba2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
