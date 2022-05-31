import { TestBed } from '@angular/core/testing';

import { ComponentMessageService } from './component-message.service';

describe('ComponentMessageService', () => {
  let service: ComponentMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
