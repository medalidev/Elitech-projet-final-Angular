import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { Role } from 'src/app/enums/role.enum';
import { CustomHttpResponse } from 'src/app/models/custom-http-response';
import { Hotel } from 'src/app/models/hotel';
import { Reservation } from 'src/app/models/reservation';
import { Room } from 'src/app/models/room';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HotelService } from 'src/app/services/hotel.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit, OnDestroy {

  @Input() admin: boolean = false;
  @Input() client: boolean = false;


  public hotels: Hotel[] = [];
  public rooms: Room[] = [];
  private subscriptions: Subscription[] = [];
  public loggedInUser: any;
  public selectedUser?: any;
  public editedHotel = new Hotel();
  public profileImage: any;
  public hotelImage: any;


  constructor(
    private authenticationService: AuthenticationService,
    private hotelService: HotelService,
    private roomService: RoomService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUserFromLocalStorage();
    this.getHotels();
  }

  public getUserRole(): string { return this.authenticationService.getUserFromLocalStorage().role; }
  public get isAdmin(): boolean { return this.getUserRole() === Role.ADMIN; }
  public get isClient(): boolean { return this.getUserRole() === Role.CLIENT }

  public getHotels(): void {
    this.subscriptions.push(
      this.hotelService.getHotels().subscribe(
        (response: Hotel[]) => {
          this.hotels = response;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }


  public getRooms(): void {
    this.subscriptions.push(
      this.roomService.getRooms().subscribe(
        (response: Room[]) => {
          this.rooms = response;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }


  public onHotelImageChange(event: any): void {
    const files = event.target.files;
    this.hotelImage = files[0];
  }

  public saveNewHotel(): void { document.getElementById("new-hotel-save")?.click(); }

  public onAddNewHotel(hotelForm: any): void {
    console.log(hotelForm);
    const formData = this.hotelService.createHotelFormData(hotelForm, this.hotelImage)
    this.subscriptions.push(
      this.hotelService.addHotel(formData).subscribe(
        (response: any) => {
          document.getElementById("new-hotel-close")?.click();
          this.getHotels();
          this.hotelImage = null;
          this.notificationService.notify(NotificationType.SUCCESS, `The new hotel was added successfully !!.`);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error);
          this.hotelImage = null;
        }
      )
    )
  }


  public onEditHotel(hotel: Hotel): void {
    this.editedHotel = hotel;
    console.log(hotel);
    document.getElementById("openHotelEdit")?.click();
  }

  public onUpdateHotel(): void {
    const formData = this.hotelService.createHotelFormData(this.editedHotel, this.hotelImage)
    this.subscriptions.push(
      this.hotelService.updateHotel(formData).subscribe(
        (response: any) => {
          document.getElementById("closeEditHotelModalButton")?.click();
          this.sendErrorNotification(NotificationType.SUCCESS, `The user information were updated successfully !!.`);
          this.getHotels();
          this.hotelImage = null;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
          this.hotelImage = null;
        }
      )
    )
  }







  public onDeleteHotel(id: any) {
    this.subscriptions.push(
      this.hotelService.deleteHotel(id).subscribe(
        (response: CustomHttpResponse) => {
          this.getHotels();
          this.sendErrorNotification(NotificationType.SUCCESS, response.message);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }







  public onLogout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
    this.notificationService.notify(NotificationType.SUCCESS, "You've been successfully logged out !!.")
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Opps !! error occured, Please try again.')
    }
  }

  public ngOnDestroy(): void { this.subscriptions.forEach(sub => sub.unsubscribe()); }
}
