import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

interface Contact { id: string; name: string; phone: string; avatar: string; initials?: string; selected: boolean; }

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  standalone: false,
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {
  step: 'members' | 'form' = 'members';
  searchQuery = '';
  contacts: Contact[] = [];
  montant = '';
  frequence = '';
  jourDebut = '';
  heureCotisation = '';
  nomCotisation = '';
  description = '';
  loading = false;

  constructor(private router: Router, private location: Location, private api: ApiService) {}

  // TODO: Load contacts from phone or backend users. For now, mock.
  ngOnInit() {
    this.contacts = [
      { id: '1', name: 'Benoit Marie', phone: '+237 6 45 41 23', avatar: '', selected: false },
      { id: '2', name: 'Vianney', phone: '+237 6 92 54 63 45', avatar: '', selected: false },
      { id: '3', name: 'Mentissa', phone: '+237 6 95 30 24 78', avatar: '', selected: false },
      { id: '4', name: 'Lava lava', phone: '+237 6 85 41 23 77', avatar: '', selected: false },
      { id: '5', name: 'Stephane', phone: '+237 6 45 41 23', avatar: '', selected: false },
      { id: '6', name: 'A Rousselana', phone: '+237 6 92 54 63 45', avatar: '', initials: 'AR', selected: false },
    ];
  }

  get selectedCount(): number { return this.contacts.filter(c => c.selected).length; }

  get groupedContacts(): { letter: string; contacts: Contact[] }[] {
    const filtered = this.searchQuery ? this.contacts.filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase())) : this.contacts;
    const groups: { [k: string]: Contact[] } = {};
    filtered.forEach(c => { const l = c.name[0].toUpperCase(); if (!groups[l]) groups[l] = []; groups[l].push(c); });
    return Object.keys(groups).sort().map(l => ({ letter: l, contacts: groups[l] }));
  }

  goBack() { if (this.step === 'form') this.step = 'members'; else this.location.back(); }
  toggleContact(c: Contact) { c.selected = !c.selected; }
  nextStep() { if (this.selectedCount > 0) this.step = 'form'; }

  createCotisation() {
    this.loading = true;
    const memberIds = this.contacts.filter(c => c.selected).map(c => c.id);

    this.api.post<any>('cotisations', {
      name: this.nomCotisation || 'Cotisation ' + this.montant,
      amount: parseInt(this.montant.replace(/\D/g, '')) || 5000,
      periodicity: this.frequence || 'weekly',
      deadlineTime: this.heureCotisation || '18:00',
      description: this.description,
      startDate: this.jourDebut || null,
      memberIds,
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/cotisation/chat'], { queryParams: { id: res.id, name: res.name } });
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/cotisation/chat'], { queryParams: { name: this.nomCotisation } });
      }
    });
  }
}
