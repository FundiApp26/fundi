import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({ selector: 'app-history-transactions', templateUrl: './history-transactions.page.html', standalone: false, styleUrls: ['./history-transactions.page.scss'] })
export class HistoryTransactionsPage {
  groups = [
    { date: 'Mardi 20 décembre', items: [
      { icon: 'cash-outline', name: 'Cotisation', sub: 'Paiement de cotisation', amount: '20.000 FCFA', time: '17:30', positive: true },
      { icon: '', name: 'Samuel Smith', sub: "Transfert d'argent", amount: '1.500 FCFA', time: '14:30', positive: true },
      { icon: 'cash-outline', name: 'Cotisation', sub: 'Paiement de cotisation', amount: '-20.000 FCFA', time: '17:30', positive: false },
      { icon: '', name: 'Stayelle', sub: "Dépôt d'argent", amount: '52.000 FCFA', time: '14:30', positive: true },
      { icon: '', name: '+237 698 142 136', sub: "Transfert d'argent", amount: '10.500 FCFA', time: '14:30', positive: true },
    ]},
    { date: 'Mardi 20 décembre', items: [
      { icon: '', name: '+237 691 352 548', sub: "Transfert d'argent", amount: '-20.000 FCFA', time: '17:30', positive: false },
      { icon: '', name: 'Stayelle', sub: "Dépôt d'argent", amount: '52.000 FCFA', time: '14:30', positive: true },
    ]}
  ];
  constructor(private location: Location) {}
  goBack() { this.location.back(); }
}
