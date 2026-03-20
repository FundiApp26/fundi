import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

interface ConversationItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  activeTab: 'cotisation' | 'discussion' = 'cotisation';
  cotisations: ConversationItem[] = [];
  discussions: ConversationItem[] = [];

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    this.loadCotisations();
    this.loadDiscussions();
  }

  loadCotisations() {
    this.api.get<any[]>('cotisations').subscribe({
      next: (list) => {
        this.cotisations = (list || []).map(c => ({
          id: c.id,
          name: c.name,
          avatar: c.avatarUrl || '',
          lastMessage: c.lastMessage?.text || '',
          time: c.lastMessage?.time ? new Date(c.lastMessage.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
          unread: 0,
        }));
      },
      error: () => {
        // Fallback mock data if API fails
        this.cotisations = [
          { id: '1', name: 'Cotisation 50.000', avatar: '', lastMessage: 'Benoit Marie: Le dépôt a été effectué', time: '18:30', unread: 3 },
          { id: '2', name: 'Cotisation 20.000', avatar: '', lastMessage: 'Steph Happi: OK je cotise ce soir', time: '15:45', unread: 0 },
        ];
      }
    });
  }

  loadDiscussions() {
    this.api.get<any[]>('discussions').subscribe({
      next: (list) => {
        this.discussions = (list || []).map(d => ({
          id: d.id,
          name: d.contact?.firstName + ' ' + d.contact?.lastName,
          avatar: d.contact?.avatarUrl || '',
          lastMessage: d.lastMessage?.text || '',
          time: d.lastMessage?.time ? new Date(d.lastMessage.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
          unread: d.unreadCount || 0,
          online: d.contact?.isOnline || false,
        }));
      },
      error: () => {
        this.discussions = [];
      }
    });
  }

  get currentList(): ConversationItem[] {
    return this.activeTab === 'cotisation' ? this.cotisations : this.discussions;
  }

  get totalUnread() {
    return {
      cotisation: this.cotisations.reduce((s, c) => s + c.unread, 0),
      discussion: this.discussions.reduce((s, c) => s + c.unread, 0),
    };
  }

  openItem(item: ConversationItem) {
    if (this.activeTab === 'cotisation') {
      this.router.navigate(['/cotisation/chat'], { queryParams: { id: item.id, name: item.name } });
    } else {
      this.router.navigate(['/discussion/chat'], { queryParams: { id: item.id, name: item.name } });
    }
  }

  onFabClick() {
    if (this.activeTab === 'cotisation') {
      this.router.navigate(['/cotisation/create']);
    } else {
      this.router.navigate(['/discussion/new']);
    }
  }

  openSearch() {}
  openMenu() { this.router.navigate(['/profile/my-profile']); }
}
