import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(request);
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      request = request.clone({
        // for Bearer token authorization, set the headers
        headers: request.headers
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json'),
        withCredentials: true,
      });
    }

    console.log('Request with Auth Header:', request);

    // For handling response, before it reaches the service,
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log('Response intercepted:', event);
          }
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            console.error('Error intercepted:', error);
          }
        },
      })
    );
  }
}
