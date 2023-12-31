import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

  private host = environment.APIEnpointsURL;

  constructor(private http: HttpClient) { }

  public addUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/api/v1/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.put<User>(`${this.host}/api/v1/user/update`, formData);
  }

  public resetUserPassword(email: string): Observable<any | HttpErrorResponse> {
    return this.http.get(`${this.host}/api/v1/user/reset-password/${email}`);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/api/v1/user/users`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/api/v1/user/update/profile-image`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public deleteUser(userId: number): Observable<any | HttpErrorResponse> {
    return this.http.delete<any>(`${this.host}/api/v1/user/delete/${userId}`);
  }

  public addUsersToLocalStorage(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalStorage(): User[] {
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users') || '');
    }
    return [];
  }

  public createUserFormData(loggedInUsername: any, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstname', user.firstname);
    formData.append('lastname', user.lastname);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNotLocked', JSON.stringify(user.notLocked));
    return formData;
  }

}