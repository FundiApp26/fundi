import { Component } from '@angular/core';
import { Location } from '@angular/common';

interface MemberItem { num: number; name: string; date: string; checked: boolean; amount?: string; detail?: string; status?: string; isBeneficiary?: boolean; }

@Component({
  selector: 'app-payment-tracking',
  templateUrl: './payment-tracking.page.html',
  standalone: false,
  styleUrls: ['./payment-tracking.page.scss'],
})
export class PaymentTrackingPage {
  view: 'members' | 'tracking' = 'members';
  searchQuery = '';
  showDetail = false;
  detailMember: MemberItem | null = null;

  members: MemberItem[] = [
    { num: 1, name: 'Stéphane', date: '03 Juillet', checked: true },
    { num: 2, name: 'Benoit Marie', date: '10 Juillet', checked: true },
    { num: 3, name: 'WABO Franço...', date: '25 Juillet', checked: true },
    { num: 4, name: 'Mpoul Dodji', date: '03 Août', checked: false },
    { num: 5, name: 'Ankaramora', date: '10 Août', checked: false },
    { num: 6, name: 'Onguene landry', date: '25 Août', checked: false },
    { num: 7, name: 'Ankaramora', date: '03 Septembre', checked: false },
    { num: 8, name: 'Nodem Bilota', date: '10 Septembre', checked: false },
    { num: 9, name: 'Mélenchon Duplex', date: '25 Septembre', checked: false },
  ];

  tracking: MemberItem[] = [
    { num: 1, name: 'Stéphane', date: '16-12-23 - 07:12m', checked: true, amount: '20.000FCFA', detail: 'Detail du dépôt' },
    { num: 2, name: 'Benoit Marie', date: '16-12-23 - 07:12m', checked: true, amount: '10.000FCFA', detail: 'Detail du dépôt' },
    { num: 3, name: 'WABO Franço...', date: '16-12-23 - 07:12m', checked: true, amount: '5.000FCFA', detail: 'Dépôt externe' },
    { num: 4, name: 'Mpoul Dodji', date: '16-12-23 - 07:12m', checked: false, isBeneficiary: true },
    { num: 5, name: 'Ankaramora', date: '16-12-23 - 12:20m', checked: true, amount: '10.000FCFA', detail: 'Detail du dépôt' },
    { num: 6, name: 'Popy', date: '16-12-23 - 20:20m', checked: false, status: 'En attente' },
    { num: 7, name: 'Achile Achile', date: '16-12-23 - 20:20m', checked: false, status: 'En attente' },
    { num: 8, name: 'Djeumeni Paola', date: '16-12-23 - 20:20m', checked: false, status: 'En attente' },
  ];

  constructor(private location: Location) {}
  goBack() { this.location.back(); }

  switchView(v: 'members' | 'tracking') { this.view = v; }

  openDetail(m: MemberItem) {
    this.detailMember = m;
    this.showDetail = true;
  }

  closeDetail() { this.showDetail = false; this.detailMember = null; }
}
