import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

@Component({ selector: 'app-edit-profile', templateUrl: './edit-profile.page.html', standalone: false, styleUrls: ['./edit-profile.page.scss'] })
export class EditProfilePage {
  menuItems = [
    { icon: 'person-outline', label: 'Mes informations personnelles' },
    { icon: 'call-outline', label: 'Changer de numéro principal' },
    { icon: 'log-out-outline', label: 'Se déconnecter', danger: true },
  ];

  constructor(private location: Location, private router: Router, private auth: AuthService, private storage: StorageService) {}

  goBack() { this.location.back(); }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/splash'], { replaceUrl: true });
    });
  }
}
