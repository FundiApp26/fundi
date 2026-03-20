import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

interface Message { text: string; time: string; sent: boolean; date?: string; }

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  standalone: false,
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  discussionId = '';
  contactName = 'Contact';
  contactAvatar = '';
  messageText = '';
  showSendMoney = false;
  showSuccess = false;
  sendAmount = '';
  selectedOperator: 'om' | 'momo' | null = null;
  confirmationName = '';
  messages: Message[] = [];
  currentUserId = '';

  constructor(private route: ActivatedRoute, private location: Location, private api: ApiService, private auth: AuthService) {}

  async ngOnInit() {
    this.discussionId = this.route.snapshot.queryParams['id'] || '';
    this.contactName = this.route.snapshot.queryParams['name'] || 'Contact';
    const user = await this.auth.getUser();
    this.currentUserId = user?.id || '';

    if (this.discussionId) this.loadMessages();
  }

  loadMessages() {
    this.api.get<any[]>(`discussions/${this.discussionId}/messages`).subscribe({
      next: (msgs) => {
        this.messages = (msgs || []).map(m => ({
          text: m.content || '',
          time: new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          sent: m.sender?.id === this.currentUserId,
        }));
      }
    });
  }

  goBack() { this.location.back(); }

  sendMessage() {
    if (!this.messageText.trim()) return;
    const text = this.messageText.trim();
    this.messageText = '';
    this.messages.push({ text, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), sent: true });

    if (this.discussionId) {
      this.api.post(`discussions/${this.discussionId}/messages`, { content: text }).subscribe();
    }
  }

  openSendMoney() { this.showSendMoney = true; this.sendAmount = ''; this.selectedOperator = null; }
  confirmSendMoney() { this.showSendMoney = false; this.showSuccess = true; }
  closeSuccess() { this.showSuccess = false; }
}
