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
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HotelService } from 'src/app/services/hotel.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  @Input() admin: boolean = false;
  @Input() client: boolean = false;

  public users: User[] = [];
  public hotels: Hotel[] = [];
  public rooms: Room[] = [];
  public reservations: Reservation[] = [];
  private subscriptions: Subscription[] = [];
  public loggedInUser: any;
  public selectedUser?: any;
  public editedUser = new User();
  public editedHotel = new Hotel();
  public editedRoom = new Room();
  public editedReservation = new Reservation();
  public profileImage: any;
  public hotelImage: any;
  public roomImage: any;

  constructor(
    private authenticationService: AuthenticationService,
    private hotelService: HotelService,
    private roomService: RoomService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUserFromLocalStorage();
    this.getRooms();
    this.getHotels()
  }

  public getUserRole(): string { return this.authenticationService.getUserFromLocalStorage().role; }
  public get isAdmin(): boolean { return this.getUserRole() === Role.ADMIN; }
  public get isClient(): boolean { return this.getUserRole() === Role.CLIENT }



  public getRooms(): void {
    this.subscriptions.push(
      this.roomService.getRooms().subscribe(
        (response: Room[]) => {
          this.rooms = response;
          console.log(' rep', response);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }



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

  public onRoomImageChange(event: any): void {
    const files = event.target.files;
    this.roomImage = files[0];
  }

  public saveNewRoom(): void { document.getElementById("new-room-save")?.click(); }

  public onAddNewRoom(roomForm: any): void {
    console.log(roomForm);
    const formData = this.roomService.createRoomFormData(roomForm, this.roomImage);
    this.subscriptions.push(
      this.roomService.addRoom(formData).subscribe(
        (response: any) => {
          document.getElementById("new-room-close")?.click();
          this.getRooms();
          this.roomImage = null;
          this.notificationService.notify(NotificationType.SUCCESS, `The new room was added successfully !!.`);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);

          this.roomImage = null;
        }
      )
    )
  }



  public onEditRoom(room: Room): void {
    this.editedRoom = room;
    console.log(room);

    document.getElementById("openRoomEdit")?.click();
  }

  public onUpdateRoom(): void {
    console.log(this.editedRoom);
    const hotelId = this.editedRoom.hotel.id
    const formData = this.roomService.createRoomFormData(this.editedRoom, this.hotelImage);
    this.subscriptions.push(
      this.roomService.updateRoom(formData).subscribe(
        (response: any) => {
          document.getElementById("closeEditRoomModalButton")?.click();
          this.sendErrorNotification(NotificationType.SUCCESS, `The user information were updated successfully !!.`);
          this.getRooms();
          this.roomImage = null;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
          this.roomImage = null;
        }
      )
    )
  }






  public onDeleteRoom(id: any) {
    this.subscriptions.push(
      this.roomService.deleteRoom(id).subscribe(
        (response: CustomHttpResponse) => {
          this.getRooms();
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

