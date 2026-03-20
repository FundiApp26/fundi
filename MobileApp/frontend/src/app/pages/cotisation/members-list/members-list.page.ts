import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.page.html',
  standalone: false,
  styleUrls: ['./members-list.page.scss'],
})
export class MembersListPage {
  cotisation = {
    name: 'Cotisation 50.000',
    status: 'En cours',
    description: 'Groupe de personne voulant cotiser pour...',
    montant: '50.000 Fcfa / Mois',
    avatar: '',
  };

  members = [
    { name: 'Benoit Marie', phone: '+237 6 45 41 23 30', avatar: '' },
    { name: 'Kouomegne Martin', phone: '+237 6 45 41 23 30', avatar: '' },
    { name: 'Vanelle Blalle', phone: '+237 6 45 41 23 30', avatar: '' },
  ];

  showDepotModal = false;
  depotType: 'app' | 'externe' = 'app';

  constructor(private router: Router, private location: Location) {}

  goBack() { this.location.back(); }

  openCotiser() { this.showDepotModal = true; }
  openListe() { this.router.navigate(['/cotisation/payment-tracking']); }
  openCalendrier() { this.router.navigate(['/cotisation/calendar']); }

  confirmDepot() {
    this.showDepotModal = false;
    if (this.depotType === 'app') {
      this.router.navigate(['/cotisation/payment-form']);
    } else {
      this.router.navigate(['/cotisation/manual-payment']);
    }
  }
}
