import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Room } from '../models/room';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RoomService {

  private host = environment.APIEnpointsURL;

  constructor(private http: HttpClient) { }

  public getRooms(): Observable<Room[]> { return this.http.get<Room[]>(`${this.host}/api/v1/room/rooms`); }
  public getRoomById(id: number): Observable<Room> { return this.http.get<Room>(`${this.host}/api/v1/room/${id}`); }
  public addRoom(formData: FormData): Observable<Room | HttpErrorResponse> { return this.http.post<Room>(`${this.host}/api/v1/room/add`, formData); }
  public deleteRoom(id: number): Observable<any | HttpErrorResponse> { return this.http.delete<any>(`${this.host}/api/v1/room/delete/${id}`); }
  public updateRoom(formData: any): Observable<Room | HttpErrorResponse> {
    return this.http.put<Room>(`${this.host}/api/v1/room/update`, formData);
  }

  public createRoomFormData(room: any, roomImage: File): FormData {
    const formData = new FormData();
    formData.append('hotelId', room.hotelId);
    formData.append('name', room.name);
    formData.append('description', room.description);
    formData.append('roomImage', roomImage);
    formData.append('price', room.price);
    formData.append('isavailable', room.isavailable);
    return formData;
  }

}