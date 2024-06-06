import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPrueba3Component } from './grafico-prueba3.component';

describe('GraficoPrueba3Component', () => {
  let component: GraficoPrueba3Component;
  let fixture: ComponentFixture<GraficoPrueba3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraficoPrueba3Component]
    });
    fixture = TestBed.createComponent(GraficoPrueba3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
