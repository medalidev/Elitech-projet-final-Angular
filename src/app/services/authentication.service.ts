import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  public host = environment.APIEnpointsURL;
  private token: any;
  private loggedInUsername: any;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/api/v1/authentication/register`, user);
  }

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/api/v1/authentication/login`, user, { observe: 'response' });
  }

  public logout(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public isUserLoggedIn(): any {

    this.loadToken();

    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logout();
      return false;
    }
  }

  public saveTokenInLocalStorage(token: string): void {
    console.log(token);
    this.token = token; localStorage.setItem('token', token);
  }
  public loadToken(): void { this.token = localStorage.getItem('token'); }
  public getToken(): string { return this.token; }
  public saveUserInLocalStorage(user: User): void { localStorage.setItem('user', JSON.stringify(user)); }
  public getUserFromLocalStorage(): any {
    let userData = localStorage.getItem('user');
    if (!userData) {
      return null;
    } else {
      return JSON.parse(userData);
    }
  }
}