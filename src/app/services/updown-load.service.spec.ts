import { TestBed } from '@angular/core/testing';

import { UpdownLoadService } from './updown-load.service';

describe('UpdownLoadService', () => {
  let service: UpdownLoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdownLoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
