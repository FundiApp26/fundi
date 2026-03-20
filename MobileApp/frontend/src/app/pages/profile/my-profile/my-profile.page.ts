import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({ selector: 'app-my-profile', templateUrl: './my-profile.page.html', standalone: false, styleUrls: ['./my-profile.page.scss'] })
export class MyProfilePage {
  user = { name: 'John Doe', phone: '+237 691 380 458', avatar: '', stats: { total: 10, enCours: 2, succes: 6, echec: 2 } };
  menuItems = [
    { icon: 'person-outline', label: 'Mon compte', route: '/profile/edit-profile' },
    { icon: 'call-outline', label: 'Mon OM et MoMo', route: '/profile/edit-profile', param: 'momo' },
    { icon: 'time-outline', label: 'Historique', route: '/history-transactions' },
    { icon: 'language-outline', label: 'Langue', route: '' },
    { icon: 'share-social-outline', label: 'Inviter des proches', route: '' },
  ];
  constructor(private router: Router, private location: Location) {}
  goBack() { this.location.back(); }
  navigate(item: any) { if (item.route) this.router.navigate([item.route]); }
}
