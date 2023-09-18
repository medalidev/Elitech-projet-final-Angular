import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ReservationComponent } from './dashboard/reservation/reservation.component';
import { ReserverComponent } from './dashboard/reserver/reserver.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reservation/:id', component: ReservationComponent },
  { path: 'reserver/:id', component: ReserverComponent },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthenticationGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
