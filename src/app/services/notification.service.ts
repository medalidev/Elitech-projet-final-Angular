import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationType } from '../enums/notification-type.enum';
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifier: NotifierService;
  constructor(private readonly notifierService: NotifierService) {
    this.notifier = notifierService
  }
  public notify(type: NotificationType, message: string) { this.notifierService.notify(type, message); }
}