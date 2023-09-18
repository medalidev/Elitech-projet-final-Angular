import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  public intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {

    if (httpRequest.url.includes(`${this.authenticationService.host}/api/v1/authentication/register`)) { return httpHandler.handle(httpRequest); }
    if (httpRequest.url.includes(`${this.authenticationService.host}/api/v1/authentication/login`)) { return httpHandler.handle(httpRequest); }
    if (httpRequest.url.includes(`${this.authenticationService.host}/api/v1/hotel`)) { return httpHandler.handle(httpRequest); }
    if (httpRequest.url.includes(`${this.authenticationService.host}/api/v1/room`)) { return httpHandler.handle(httpRequest); }
    if (httpRequest.url.includes(`${this.authenticationService.host}/api/v1/user`)) { return httpHandler.handle(httpRequest); }


    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    if (token !== null) {
      //intercept the token in request
      const newReq = httpRequest.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        },
      });
      console.log(token);

      return httpHandler.handle(newReq);
    } else {
      return httpHandler.handle(httpRequest);
    }

  }
}