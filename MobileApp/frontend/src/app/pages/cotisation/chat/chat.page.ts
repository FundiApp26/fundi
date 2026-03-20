import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

interface Message { id?: string; text: string; time: string; sent: boolean; sender?: string; senderPhone?: string; date?: string; }

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  standalone: false,
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  groupId = '';
  groupName = 'Cotisation 50.000';
  groupSubtitle = 'Voir les détails du groupe';
  isTerminated = false;
  messageText = '';
  messages: Message[] = [];
  currentUserId = '';

  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private api: ApiService, private auth: AuthService) {}

  async ngOnInit() {
    this.groupId = this.route.snapshot.queryParams['id'] || '';
    this.groupName = this.route.snapshot.queryParams['name'] || 'Cotisation';
    const user = await this.auth.getUser();
    this.currentUserId = user?.id || '';

    if (this.groupId) {
      this.loadMessages();
      this.loadCotisationInfo();
    }
  }

  loadCotisationInfo() {
    this.api.get<any>(`cotisations/${this.groupId}`).subscribe({
      next: (c) => {
        this.groupName = c.name;
        this.isTerminated = c.status === 'completed';
      }
    });
  }

  loadMessages() {
    this.api.get<any[]>(`messages/cotisation/${this.groupId}`).subscribe({
      next: (msgs) => {
        this.messages = (msgs || []).map(m => ({
          id: m.id,
          text: m.content || '',
          time: new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          sent: m.sender?.id === this.currentUserId,
          sender: m.sender ? m.sender.firstName + ' ' + m.sender.lastName : '',
          senderPhone: m.sender?.phone,
        }));
      },
      error: () => {
        // Keep empty if API fails
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

    // Optimistic UI
    this.messages.push({ text, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), sent: true });

    if (this.groupId) {
      this.api.post(`messages/cotisation/${this.groupId}`, { content: text }).subscribe();
    }
  }

  relancerCotisation() { this.isTerminated = false; }
}
