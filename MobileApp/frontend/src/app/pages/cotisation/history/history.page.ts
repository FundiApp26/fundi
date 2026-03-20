import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  standalone: false,
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  tontines = [
    { name: 'Tontine 4', status: 'En cours', amount: '5000 Fcfa/s', duration: '7 Mois', echec: '' },
    { name: 'Tontine 3', status: 'Terminé', amount: '5000 Fcfa/s', duration: '6 Mois', echec: 'Échec 1' },
    { name: 'Tontine 2', status: 'Terminé', amount: '5000 Fcfa/s', duration: '4 Mois', echec: 'Aucun échec' },
    { name: 'Tontine 1', status: 'Terminé', amount: '5000 Fcfa/s', duration: '2 Mois', echec: 'Aucun échec' },
  ];

  constructor(private location: Location) {}
  goBack() { this.location.back(); }
}
