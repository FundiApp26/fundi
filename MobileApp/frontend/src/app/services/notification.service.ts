import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';

export interface FundiNotification {
  title: string;
  body: string;
  data: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationReceived$ = new Subject<FundiNotification>();
  private notificationAction$ = new Subject<ActionPerformed>();

  /** Emits when a push notification is received while app is in foreground */
  onNotification$ = this.notificationReceived$.asObservable();
  /** Emits when user taps on a notification */
  onNotificationAction$ = this.notificationAction$.asObservable();

  constructor(private api: ApiService) {}

  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications not available on web');
      return;
    }

    const permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') {
        console.warn('Push notification permission denied');
        return;
      }
    } else if (permStatus.receive !== 'granted') {
      console.warn('Push notification permission not granted');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration token:', token.value);
      this.registerTokenOnServer(token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      this.notificationReceived$.next({
        title: notification.title ?? '',
        body: notification.body ?? '',
        data: (notification.data as Record<string, unknown>) ?? {}
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      this.notificationAction$.next(action);
    });
  }

  private registerTokenOnServer(token: string): void {
    this.api.post('notifications/register-token', { token }).subscribe({
      next: () => console.log('Push token registered on server'),
      error: (err) => console.error('Failed to register push token:', err)
    });
  }
}
