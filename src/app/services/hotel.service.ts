import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Hotel } from '../models/hotel';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private host = environment.APIEnpointsURL;

  constructor(private http: HttpClient) { }

  public addHotel(formData: FormData): Observable<Hotel | HttpErrorResponse> {
    return this.http.post<Hotel>(`${this.host}/api/v1/hotel/add`, formData);
  }

  public updateHotel(formData: any): Observable<Hotel | HttpErrorResponse> {
    return this.http.put<Hotel>(`${this.host}/api/v1/hotel/update`, formData);
  }

  public getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.host}/api/v1/hotel/hotels`);
  }


  public deleteHotel(id: number): Observable<any | HttpErrorResponse> {
    return this.http.delete<any>(`${this.host}/api/v1/hotel/delete/${id}`);
  }

  public createHotelFormData(hotel: any, hotelImage: File): FormData {
    const formData = new FormData();
    formData.append('id', hotel.id);
    formData.append('name', hotel.name);
    formData.append('description', hotel.description);
    formData.append('isavailable', hotel.isavailable);
    formData.append('isapproved', hotel.isapproved);
    formData.append('hotelImage', hotelImage);
    return formData;
  }

}