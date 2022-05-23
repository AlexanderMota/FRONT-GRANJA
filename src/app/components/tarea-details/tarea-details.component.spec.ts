import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaDetailsComponent } from './tarea-details.component';

describe('TareaDetailsComponent', () => {
  let component: TareaDetailsComponent;
  let fixture: ComponentFixture<TareaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TareaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TareaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
