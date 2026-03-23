import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
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

  showSearch = false;
  searchQuery = '';

  constructor(private router: Router, private api: ApiService, private actionSheet: ActionSheetController) {}

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
        this.cotisations = [
          { id: '1', name: 'Cotisation 50.000', avatar: '', lastMessage: 'Benoit Marie: Le dépôt a été effectué', time: '18:30', unread: 3 },
          { id: '2', name: 'Cotisation 20.000', avatar: '', lastMessage: 'Simply dummy text of the printing and ty...', time: '10:15', unread: 0 },
          { id: '3', name: 'Cotisation 10.000', avatar: '', lastMessage: 'Hey !', time: '07:32', unread: 1 },
          { id: '4', name: 'Cotisation 5.000', avatar: '', lastMessage: 'Lorem Ipsum is simply dummy text', time: 'Apr 25 2021', unread: 0 },
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
        this.discussions = [
          { id: '1', name: 'Steph Happi', avatar: '', lastMessage: 'Salut toi ! Comment tu vas ?', time: '15:45', unread: 3, online: true },
          { id: '2', name: 'Blonde De Londre', avatar: '', lastMessage: 'Simply dummy text of the printing and ty...', time: '10:15', unread: 0, online: false },
          { id: '3', name: 'Yannick Fabregas Sadjap', avatar: '', lastMessage: 'Hey !', time: '07:32', unread: 1, online: false },
          { id: '4', name: 'Khadij M.', avatar: '', lastMessage: 'Lorem Ipsum is simply dummy text', time: 'Apr 25 2021', unread: 0, online: false },
          { id: '5', name: 'Sacha Mansem', avatar: '', lastMessage: 'The printing and typesetting industr...', time: 'Mar 12 2021', unread: 0, online: false },
          { id: '6', name: 'Brenda Maboma', avatar: '', lastMessage: 'Simply dummy text of the printing and s...', time: '10:15', unread: 0, online: false },
        ];
      }
    });
  }

  get currentList(): ConversationItem[] {
    const list = this.activeTab === 'cotisation' ? this.cotisations : this.discussions;
    if (!this.searchQuery) return list;
    const q = this.searchQuery.toLowerCase();
    return list.filter(c => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
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

  openSearch() { this.showSearch = !this.showSearch; this.searchQuery = ''; }
  onSearch() {}

  async openMenu() {
    const sheet = await this.actionSheet.create({
      buttons: [
        { text: 'Mon profil', icon: 'person-outline', handler: () => { this.router.navigate(['/profile/my-profile']); } },
        { text: 'Nouvelle cotisation', icon: 'add-circle-outline', handler: () => { this.router.navigate(['/cotisation/create']); } },
        { text: 'Nouvelle discussion', icon: 'chatbubble-outline', handler: () => { this.router.navigate(['/discussion/new']); } },
        { text: 'Inviter des proches', icon: 'share-social-outline' },
        { text: 'Premium', icon: 'diamond-outline', handler: () => { this.router.navigate(['/premium']); } },
        { text: 'Notifications', icon: 'notifications-outline', handler: () => { this.router.navigate(['/notifications']); } },
        { text: 'Historique', icon: 'time-outline', handler: () => { this.router.navigate(['/history-transactions']); } },
        { text: 'À propos', icon: 'information-circle-outline', handler: () => { this.router.navigate(['/about']); } },
        { text: 'Annuler', role: 'cancel', icon: 'close-outline' },
      ],
    });
    await sheet.present();
  }
}
