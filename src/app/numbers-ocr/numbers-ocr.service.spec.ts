import { TestBed } from '@angular/core/testing';

import { NumbersOCRService } from './numbers-ocr.service';

describe('NumbersOCRService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NumbersOCRService = TestBed.get(NumbersOCRService);
    expect(service).toBeTruthy();
  });
});
