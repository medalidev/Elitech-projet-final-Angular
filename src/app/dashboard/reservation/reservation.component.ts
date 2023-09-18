import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { Role } from 'src/app/enums/role.enum';
import { CustomHttpResponse } from 'src/app/models/custom-http-response';
import { Reservation } from 'src/app/models/reservation';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  @Input() admin: boolean = false;
  @Input() client: boolean = false;

  public loggedInUser: any;
  public room: any;
  public reservations: Reservation[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private roomService: RoomService,
    private reservationService: ReservationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUserFromLocalStorage();
    this.activatedRoute.paramMap.subscribe(() => { this.getRoomById() })
  }

  public getRoomById() {
    const id: number = +this.activatedRoute.snapshot.params['id'];
    this.roomService.getRoomById(id).subscribe(
      (data) => {
        this.room = data;
      }
    )
  }


  public getUserRole(): string { return this.authenticationService.getUserFromLocalStorage().role; }
  public get isAdmin(): boolean { return this.getUserRole() === Role.ADMIN; }
  public get isClient(): boolean { return this.getUserRole() === Role.CLIENT }

  public getReservations(): void {
    this.subscriptions.push(
      this.reservationService.getReservations().subscribe(
        (response: Reservation[]) => {
          this.reservations = response;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }

  public changeReservationStatus(reservation: Reservation) {
    this.subscriptions.push(
      this.reservationService.changeReservationStatus(reservation).subscribe(
        (response: any) => {
          this.sendErrorNotification(NotificationType.SUCCESS, `The Reservation status was updated successfully !!.`);
          this.getReservations();
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }

  public deleteReservation(id: any) {
    this.subscriptions.push(
      this.reservationService.deleteReservation(id).subscribe(
        (response: CustomHttpResponse) => {
          this.getReservations();
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