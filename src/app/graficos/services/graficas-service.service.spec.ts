import { TestBed } from '@angular/core/testing';

import { GraficasServiceService } from './graficas-service.service';

describe('GraficasServiceService', () => {
  let service: GraficasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
