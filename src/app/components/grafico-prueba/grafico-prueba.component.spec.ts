import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPruebaComponent } from './grafico-prueba.component';

describe('GraficoPruebaComponent', () => {
  let component: GraficoPruebaComponent;
  let fixture: ComponentFixture<GraficoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
