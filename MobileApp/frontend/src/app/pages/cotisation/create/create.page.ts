import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface Contact { name: string; phone: string; avatar: string; initials?: string; selected: boolean; }

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  standalone: false,
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  step: 'members' | 'form' = 'members';
  searchQuery = '';

  contacts: Contact[] = [
    { name: 'Benoit Marie', phone: '+237 6 45 41 23', avatar: '', selected: false },
    { name: 'Vianney', phone: '+237 6 92 54 63 45', avatar: '', selected: false },
    { name: 'Mentissa', phone: '+237 6 95 30 24 78', avatar: '', selected: false },
    { name: 'Lava lava', phone: '+237 6 85 41 23 77', avatar: '', selected: false },
    { name: 'Stephane', phone: '+237 6 45 41 23', avatar: '', selected: false },
    { name: 'A Rousselana', phone: '+237 6 92 54 63 45', avatar: '', initials: 'AR', selected: false },
    { name: 'Manuela', phone: '+237 6 45 41 23', avatar: '', selected: false },
  ];

  // Form fields
  montant = '';
  frequence = '';
  jourDebut = '';
  heureCotisation = '';
  nomCotisation = '';
  description = '';

  constructor(private router: Router, private location: Location) {}

  get selectedCount(): number { return this.contacts.filter(c => c.selected).length; }

  get groupedContacts(): { letter: string; contacts: Contact[] }[] {
    const filtered = this.searchQuery
      ? this.contacts.filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      : this.contacts;
    const groups: { [k: string]: Contact[] } = {};
    filtered.forEach(c => { const l = c.name[0].toUpperCase(); if (!groups[l]) groups[l] = []; groups[l].push(c); });
    return Object.keys(groups).sort().map(l => ({ letter: l, contacts: groups[l] }));
  }

  goBack() {
    if (this.step === 'form') { this.step = 'members'; }
    else { this.location.back(); }
  }

  toggleContact(c: Contact) { c.selected = !c.selected; }

  nextStep() {
    if (this.selectedCount > 0) this.step = 'form';
  }

  createCotisation() {
    this.router.navigate(['/cotisation/chat'], { queryParams: { name: this.nomCotisation || 'Cotisation ' + this.montant } });
  }
}
