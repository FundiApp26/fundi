import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  standalone: false,
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage {
  isAdmin = true;
  user = {
    name: 'Steph Happi',
    avatar: '',
    phone1: '+237 691 568 741',
    phone2: '+237 678 253 644',
    stats: { total: 10, enCours: 2, succes: 6, echec: 2 },
    montantHaut: '20 000 Fcfa',
    montantBas: '3 500 Fcfa',
    cote: '12/20',
  };

  groupsEnCommun = [
    { name: 'Cotisation 5000fcfa', members: 'Declo, Stéphane, Dody, Benoit, François, Popy, Yvest...' },
    { name: 'Cotisation 2000fcfa', members: 'Declo, Stéphane, Dody, Benoit, François, Popy, Yvest...' },
  ];

  constructor(private location: Location) {}
  goBack() { this.location.back(); }
}
