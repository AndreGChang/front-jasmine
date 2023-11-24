import { TestBed } from '@angular/core/testing';

import { HttpinterceptorService } from './httpinterceptor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthTokenService } from '../shared/auth-token.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('HttpinterceptorService', () => {
  let service: HttpinterceptorService;
  let authTokenService: AuthTokenService;
  let httpClient: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        HttpinterceptorService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpinterceptorService, multi: true },
        AuthTokenService
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HttpinterceptorService);
    authTokenService = TestBed.inject(AuthTokenService);
    service = TestBed.inject(HttpinterceptorService);
  });

  afterEach(() => {
    httpController.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve adicionar o cabeçalho de autorização se o token estiver presente', () => {
    spyOn(authTokenService, 'getToken').and.returnValue('fake-token');

    httpClient.get('/data').subscribe(response => {
      // Testa se a resposta é recebida (não importa o conteúdo para este teste)
      expect(response).toBeTruthy();
    });

    const httpRequest = httpController.expectOne('/data');

    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual('fake-token');

    httpRequest.flush({ data: 'test data' });
  });

  it('não deve adicionar o cabeçalho de autorização se o token não estiver presente', () => {
    spyOn(authTokenService, 'getToken').and.returnValue(null);

    httpClient.get('/data').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpController.expectOne('/data');

    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);

    httpRequest.flush({ data: 'test data' });
  });

});
