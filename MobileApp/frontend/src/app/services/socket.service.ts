import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
}

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {

  private socket: Socket | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  async connect(): Promise<void> {
    const token = await this.authService.getToken();
    if (!token) {
      console.warn('SocketService: No auth token, skipping connection');
      return;
    }

    this.socket = io(environment.socketUrl, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string): void {
    this.socket?.emit('join-room', { roomId });
  }

  leaveRoom(roomId: string): void {
    this.socket?.emit('leave-room', { roomId });
  }

  sendMessage(roomId: string, content: string, type: 'text' | 'image' = 'text'): void {
    this.socket?.emit('send-message', { roomId, content, type });
  }

  onMessage(): Observable<ChatMessage> {
    return new Observable<ChatMessage>(observer => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }
      this.socket.on('new-message', (message: ChatMessage) => {
        observer.next(message);
      });
      return () => {
        this.socket?.off('new-message');
      };
    });
  }

  onEvent<T = unknown>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });
      return () => {
        this.socket?.off(event);
      };
    });
  }

  emit(event: string, data: unknown): void {
    this.socket?.emit(event, data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
