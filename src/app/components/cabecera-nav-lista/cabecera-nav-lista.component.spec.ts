import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceraNavListaComponent } from './cabecera-nav-lista.component';

describe('CabeceraNavListaComponent', () => {
  let component: CabeceraNavListaComponent;
  let fixture: ComponentFixture<CabeceraNavListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CabeceraNavListaComponent]
    });
    fixture = TestBed.createComponent(CabeceraNavListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
