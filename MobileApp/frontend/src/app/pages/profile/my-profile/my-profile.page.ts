import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({ selector: 'app-my-profile', templateUrl: './my-profile.page.html', standalone: false, styleUrls: ['./my-profile.page.scss'] })
export class MyProfilePage implements OnInit {
  user: any = { firstName: '', lastName: '', phone: '', avatarUrl: '', stats: { total: 0, enCours: 0, succes: 0, echec: 0 } };
  menuItems = [
    { icon: 'person-outline', label: 'Mon compte', route: '/profile/edit-profile' },
    { icon: 'call-outline', label: 'Mon OM et MoMo', route: '/profile/edit-profile' },
    { icon: 'time-outline', label: 'Historique', route: '/history-transactions' },
    { icon: 'language-outline', label: 'Langue', route: '' },
    { icon: 'share-social-outline', label: 'Inviter des proches', route: '' },
  ];

  constructor(private router: Router, private location: Location, private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('users/me').subscribe({
      next: (u) => { this.user = u; }
    });
  }

  goBack() { this.location.back(); }
  navigate(item: any) { if (item.route) this.router.navigate([item.route]); }
}
