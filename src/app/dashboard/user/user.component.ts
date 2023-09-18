import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { Role } from 'src/app/enums/role.enum';
import { CustomHttpResponse } from 'src/app/models/custom-http-response';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  @Input() admin: boolean = false;
  @Input() client: boolean = false;

  public users: User[] = [];
  private subscriptions: Subscription[] = [];
  public loggedInUser: any;
  public selectedUser?: any;
  private currentUsername?: string;
  public editedUser = new User();
  public profileImage: any;


  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authenticationService.getUserFromLocalStorage();
    this.getUsers();
  }

  public getUserRole(): string { return this.authenticationService.getUserFromLocalStorage().role; }
  public get isAdmin(): boolean { return this.getUserRole() === Role.ADMIN; }
  public get isClient(): boolean { return this.getUserRole() === Role.CLIENT }

  public getUsers(): void {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.users = response;
          this.userService.addUsersToLocalStorage(this.users);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }

  public onProfileImageChange(event: any): void {
    const files = event.target.files;
    this.profileImage = files[0];
  }

  public saveNewUser(): void { document.getElementById("new-user-save")?.click(); }

  public onAddNewUser(userForm: any): void {
    const formData = this.userService.createUserFormData(null, userForm, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: any) => {
          document.getElementById("new-user-close")?.click();
          this.getUsers();
          this.profileImage = null;
          this.notificationService.notify(NotificationType.SUCCESS, `The new user was added successfully !!.`);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
          this.profileImage = null;
        }
      )
    )
  }

  public onEditUser(user: User): void {
    this.editedUser = user;
    this.currentUsername = user.username;
    document.getElementById("openUserEdit")?.click();
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormData(this.currentUsername, this.editedUser, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: any) => {
          document.getElementById("closeEditUserModalButton")?.click();
          this.sendErrorNotification(NotificationType.SUCCESS, `The user information were updated successfully !!.`);
          this.getUsers();
          this.profileImage = null;
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
          this.profileImage = null;
        }
      )
    )
  }

  public onDeleteUser(id: any) {
    this.subscriptions.push(
      this.userService.deleteUser(id).subscribe(
        (response: CustomHttpResponse) => {
          this.sendErrorNotification(NotificationType.SUCCESS, response.message);
          this.getUsers();
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, httpErrorResponse.error.message);
        }
      )
    )
  }

  public onSelectUser(selectedUser: User) {
    this.selectedUser = selectedUser;
    document.getElementById("openUserInfo")?.click();
  }

  public searchInUsersList(keyword: string) {
    const searchResults: User[] = [];
    for (const user of this.userService.getUsersFromLocalStorage()) {
      if (
        user.firstname.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1 ||
        user.lastname.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1 ||
        user.username.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1
      ) {
        searchResults.push(user);
      }
    }
    this.users = searchResults;
    if (searchResults.length == 0 || !keyword) { this.users = this.userService.getUsersFromLocalStorage(); }
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
