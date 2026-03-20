import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface Contact {
  name: string;
  phone: string;
  avatar: string;
  initials?: string;
}

@Component({
  selector: 'app-new-discussion',
  templateUrl: './new-discussion.page.html',
  standalone: false,
  styleUrls: ['./new-discussion.page.scss'],
})
export class NewDiscussionPage {
  searchQuery = '';

  contacts: Contact[] = [
    { name: 'Vianney', phone: '+237 6 92 54 63 45', avatar: '' },
    { name: 'Mentissa', phone: '+237 6 95 30 24 78', avatar: '' },
    { name: 'Lava lava', phone: '+237 6 85 41 23 77', avatar: '' },
    { name: 'Stephane', phone: '+237 6 45 41 23', avatar: '' },
    { name: 'A Rousselana', phone: '+237 6 92 54 63 45', avatar: '', initials: 'AR' },
    { name: 'Manuela', phone: '+237 6 45 41 23', avatar: '' },
    { name: 'Sone', phone: '+237 6 92 54 63 45', avatar: '' },
  ];

  constructor(private router: Router, private location: Location) {}

  get groupedContacts(): { letter: string; contacts: Contact[] }[] {
    const filtered = this.searchQuery
      ? this.contacts.filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      : this.contacts;

    const groups: { [key: string]: Contact[] } = {};
    filtered.forEach(c => {
      const letter = c.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(c);
    });

    return Object.keys(groups).sort().map(letter => ({ letter, contacts: groups[letter] }));
  }

  goBack() { this.location.back(); }

  selectContact(contact: Contact) {
    this.router.navigate(['/discussion/chat'], { queryParams: { name: contact.name } });
  }

  invitePerson() {
    // TODO: share invitation link
  }
}
