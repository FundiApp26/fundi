import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

interface Contact { id: string; name: string; phone: string; avatar: string; initials?: string; }

@Component({
  selector: 'app-new-discussion',
  templateUrl: './new-discussion.page.html',
  standalone: false,
  styleUrls: ['./new-discussion.page.scss'],
})
export class NewDiscussionPage {
  searchQuery = '';
  contacts: Contact[] = [
    { id: '1', name: 'Vianney', phone: '+237 6 92 54 63 45', avatar: '' },
    { id: '2', name: 'Mentissa', phone: '+237 6 95 30 24 78', avatar: '' },
    { id: '3', name: 'Lava lava', phone: '+237 6 85 41 23 77', avatar: '' },
    { id: '4', name: 'Stephane', phone: '+237 6 45 41 23', avatar: '' },
    { id: '5', name: 'A Rousselana', phone: '+237 6 92 54 63 45', avatar: '', initials: 'AR' },
    { id: '6', name: 'Manuela', phone: '+237 6 45 41 23', avatar: '' },
  ];

  constructor(private router: Router, private location: Location, private api: ApiService) {}

  get groupedContacts(): { letter: string; contacts: Contact[] }[] {
    const filtered = this.searchQuery ? this.contacts.filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase())) : this.contacts;
    const groups: { [key: string]: Contact[] } = {};
    filtered.forEach(c => { const letter = c.name[0].toUpperCase(); if (!groups[letter]) groups[letter] = []; groups[letter].push(c); });
    return Object.keys(groups).sort().map(letter => ({ letter, contacts: groups[letter] }));
  }

  goBack() { this.location.back(); }

  selectContact(contact: Contact) {
    // Create or get discussion, then navigate
    this.api.post<any>('discussions', { userId: contact.id }).subscribe({
      next: (disc) => {
        this.router.navigate(['/discussion/chat'], { queryParams: { id: disc.id, name: contact.name } });
      },
      error: () => {
        this.router.navigate(['/discussion/chat'], { queryParams: { name: contact.name } });
      }
    });
  }

  invitePerson() { /* TODO: share invitation link */ }
}
