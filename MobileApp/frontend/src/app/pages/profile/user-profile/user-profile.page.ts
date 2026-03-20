import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiService } from '../../../services/api.service';

@Component({ selector: 'app-user-profile', templateUrl: './user-profile.page.html', standalone: false, styleUrls: ['./user-profile.page.scss'] })
export class UserProfilePage implements OnInit {
  isAdmin = false;
  user: any = { firstName: '', lastName: '', phone: '', avatarUrl: '', stats: { total: 0, enCours: 0, succes: 0, echec: 0, montantHaut: 0, montantBas: 0, cote: 0 } };
  groupsEnCommun: any[] = [];

  constructor(private route: ActivatedRoute, private location: Location, private api: ApiService) {}

  ngOnInit() {
    const userId = this.route.snapshot.queryParams['id'] || '';
    if (userId) {
      this.api.get<any>(`users/${userId}`).subscribe({
        next: (u) => {
          this.user = u;
          this.isAdmin = u.isAdmin || false;
          this.groupsEnCommun = u.groupsEnCommun || [];
        }
      });
    }
  }

  goBack() { this.location.back(); }
}
