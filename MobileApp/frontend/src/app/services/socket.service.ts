import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  async connect(): Promise<void> {
    if (this.socket?.connected) return;

    const token = await this.authService.getToken();
    if (!token) return;

    this.socket = io(environment.socketUrl, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => console.log('[Socket] Connected:', this.socket?.id));
    this.socket.on('disconnect', (r) => console.log('[Socket] Disconnected:', r));
    this.socket.on('connect_error', (e) => console.error('[Socket] Error:', e.message));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  // Send discussion message (real-time)
  sendDiscussionMessage(discussionId: string, content: string, mediaUrl?: string) {
    this.socket?.emit('send_discussion_message', { discussionId, content, mediaUrl });
  }

  // Send cotisation group message (real-time)
  sendCotisationMessage(cotisationId: string, content: string, mediaUrl?: string) {
    this.socket?.emit('send_cotisation_message', { cotisationId, content, mediaUrl });
  }

  // Typing indicators
  startTyping(roomId: string, roomType: 'discussion' | 'cotisation') {
    this.socket?.emit('typing', { roomId, roomType });
  }

  stopTyping(roomId: string, roomType: 'discussion' | 'cotisation') {
    this.socket?.emit('stop_typing', { roomId, roomType });
  }

  // Listen for new messages
  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('new_message', (msg) => observer.next(msg));
      return () => this.socket?.off('new_message');
    });
  }

  // Listen for typing
  onUserTyping(): Observable<{ userId: string; roomId: string }> {
    return new Observable(observer => {
      this.socket?.on('user_typing', (data) => observer.next(data));
      return () => this.socket?.off('user_typing');
    });
  }

  onUserStopTyping(): Observable<{ userId: string; roomId: string }> {
    return new Observable(observer => {
      this.socket?.on('user_stop_typing', (data) => observer.next(data));
      return () => this.socket?.off('user_stop_typing');
    });
  }

  // Online status
  onUserOnline(): Observable<{ userId: string }> {
    return new Observable(observer => {
      this.socket?.on('user_online', (data) => observer.next(data));
      return () => this.socket?.off('user_online');
    });
  }

  onUserOffline(): Observable<{ userId: string }> {
    return new Observable(observer => {
      this.socket?.on('user_offline', (data) => observer.next(data));
      return () => this.socket?.off('user_offline');
    });
  }

  // System messages (payment notifications in cotisation)
  onSystemMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('system_message', (msg) => observer.next(msg));
      return () => this.socket?.off('system_message');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
