import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NotifierModule } from 'angular-notifier';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotifierModule.withConfig({
      position: {

        horizontal: {

          /**
           * Defines the horizontal position on the screen
           * @type {'left' | 'middle' | 'right'}
           */
          position: 'right',

          /**
           * Defines the horizontal distance to the screen edge (in px)
           * @type {number}
           */
          distance: 12

        },

        vertical: {

          /**
           * Defines the vertical position on the screen
           * @type {'top' | 'bottom'}
           */
          position: 'top',

          /**
           * Defines the vertical distance to the screen edge (in px)
           * @type {number}
           */
          distance: 12,

          /**
           * Defines the vertical gap, existing between multiple notifications (in px)
           * @type {number}
           */
          gap: 10

        }

      },

    }),
  ],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
