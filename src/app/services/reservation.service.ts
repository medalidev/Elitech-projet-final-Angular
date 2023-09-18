import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Room } from '../models/room';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {

  private host = environment.APIEnpointsURL;

  constructor(private http: HttpClient) { }

  public addReservation(formData: FormData): Observable<any | HttpErrorResponse> {
    return this.http.post<any>(`${this.host}/api/v1/reservation/add`, formData);
  }

  public getReservations(): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${this.host}/api/v1/reservations`); }
  public getReservationsByClientId(clientId: number): Observable<any> {
    return this.http.get<any>(`${this.host}/api/v1/client/reservations/${clientId}`);
  }

  public changeReservationStatus(reservation: Reservation): Observable<any> {
    return this.http.get<any>(`${this.host}/api/v1/reservation/update/${reservation.id}`);
  }

  public deleteReservation(id: number): Observable<any | HttpErrorResponse> {
    return this.http.delete<any>(`${this.host}/api/v1/reservation/delete/${id}`);
  }

  public createReservationFormData(clientId: any, roomId: any, reservation: Reservation): FormData {
    const formData = new FormData();
    formData.append('clientId', clientId);
    formData.append('roomId', roomId);
    formData.append('checking', reservation.checking);
    formData.append('checkout', reservation.checkout);
    return formData;
  }

}