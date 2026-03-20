import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { SocketService } from '../../../services/socket.service';

interface Message { text: string; time: string; sent: boolean; sender?: string; senderPhone?: string; date?: string; }

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  standalone: false,
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  groupId = '';
  groupName = 'Cotisation';
  groupSubtitle = 'Voir les détails du groupe';
  isTerminated = false;
  messageText = '';
  messages: Message[] = [];
  currentUserId = '';
  private msgSub?: Subscription;
  private sysSub?: Subscription;

  constructor(
    private route: ActivatedRoute, private router: Router, private location: Location,
    private api: ApiService, private auth: AuthService, private socket: SocketService
  ) {}

  async ngOnInit() {
    this.groupId = this.route.snapshot.queryParams['id'] || '';
    this.groupName = this.route.snapshot.queryParams['name'] || 'Cotisation';
    const user = await this.auth.getUser();
    this.currentUserId = user?.id || '';

    if (this.groupId) {
      this.loadMessages();
      this.loadCotisationInfo();

      // Real-time messages
      this.msgSub = this.socket.onNewMessage().subscribe(msg => {
        if (msg.cotisationId === this.groupId && msg.sender?.id !== this.currentUserId) {
          this.messages.push({
            text: msg.content || '', sender: msg.sender?.firstName + ' ' + msg.sender?.lastName,
            senderPhone: msg.sender?.phone,
            time: new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            sent: false,
          });
        }
      });

      // System messages (payment notifications)
      this.sysSub = this.socket.onSystemMessage().subscribe(msg => {
        if (msg.cotisationId === this.groupId) {
          this.messages.push({ text: msg.content, time: '', sent: false, sender: 'Système' });
        }
      });
    }
  }

  ngOnDestroy() { this.msgSub?.unsubscribe(); this.sysSub?.unsubscribe(); }

  loadCotisationInfo() {
    this.api.get<any>(`cotisations/${this.groupId}`).subscribe({
      next: (c) => { this.groupName = c.name; this.isTerminated = c.status === 'completed'; }
    });
  }

  loadMessages() {
    this.api.get<any[]>(`messages/cotisation/${this.groupId}`).subscribe({
      next: (msgs) => {
        this.messages = (msgs || []).map(m => ({
          text: m.content || '', sender: m.sender ? m.sender.firstName + ' ' + m.sender.lastName : '',
          senderPhone: m.sender?.phone,
          time: new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          sent: m.sender?.id === this.currentUserId,
        }));
      }
    });
  }

  goBack() { this.location.back(); }
  openProfile() { this.router.navigate(['/cotisation/members-list'], { queryParams: { id: this.groupId } }); }
  openCalendar() { this.router.navigate(['/cotisation/calendar'], { queryParams: { id: this.groupId } }); }

  sendMessage() {
    if (!this.messageText.trim() || this.isTerminated) return;
    const text = this.messageText.trim();
    this.messageText = '';

    // Send via Socket
    this.socket.sendCotisationMessage(this.groupId, text);

    // REST fallback
    this.api.post(`messages/cotisation/${this.groupId}`, { content: text }).subscribe();

    // Optimistic UI
    this.messages.push({ text, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), sent: true });
  }

  relancerCotisation() { this.isTerminated = false; }
}
