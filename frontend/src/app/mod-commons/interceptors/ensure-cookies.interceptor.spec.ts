import { TestBed } from '@angular/core/testing';

import { EnsureCookiesInterceptor } from './ensure-cookies.interceptor';

describe('EnsureCookiesInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      EnsureCookiesInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: EnsureCookiesInterceptor = TestBed.inject(EnsureCookiesInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
