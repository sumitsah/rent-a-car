import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token = localStorage.getItem("token");
    // let token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVkODc3NmI5YmJlOTg4M2NkYjg2NGY1In0sImlhdCI6MTcwODY4NzI5Mn0.GBvKQQGKJHKUwc_1kUbA5MUS1b-OWFREOXV6JthpwHg`
    let newRequest: HttpRequest<any>;
    newRequest = request.clone({
      headers: request.headers.set("Authorization", "Bearer " + token)
    })
    return next.handle(newRequest);
  }
}
