import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { TestingModule } from '../test/TestingModule';
import { HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingModule
    ]
  }));
  
  beforeEach(() => {
    service = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
