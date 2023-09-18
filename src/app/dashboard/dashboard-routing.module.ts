import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HotelComponent } from './hotel/hotel.component';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { UserComponent } from './user/user.component';
import { RoomComponent } from './room/room.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ReserverComponent } from './reserver/reserver.component';

const routes: Routes = [{
  path: '', component: DashboardComponent, canActivate: [AuthenticationGuard],
  children: [
    {
      path: 'user', component: UserComponent
    }, {
      path: 'hotel', component: HotelComponent
    }, {
      path: 'room', component: RoomComponent
    }, {
      path: 'reservation', component: ReservationComponent
    }
  ]
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
