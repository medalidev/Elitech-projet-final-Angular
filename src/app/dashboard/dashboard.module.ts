import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RoomComponent } from './room/room.component';
import { UserComponent } from './user/user.component';
import { HotelComponent } from './hotel/hotel.component';
import { ReservationComponent } from './reservation/reservation.component';
import { FormsModule } from '@angular/forms';
import { ReserverComponent } from './reserver/reserver.component';


@NgModule({
  declarations: [
    DashboardComponent,
    RoomComponent,
    UserComponent,
    HotelComponent,
    ReservationComponent,
    ReserverComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
