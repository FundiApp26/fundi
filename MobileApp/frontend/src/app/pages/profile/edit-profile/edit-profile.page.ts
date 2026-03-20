import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({ selector: 'app-edit-profile', templateUrl: './edit-profile.page.html', standalone: false, styleUrls: ['./edit-profile.page.scss'] })
export class EditProfilePage {
  menuItems = [
    { icon: 'person-outline', label: 'Mes informations personnelles' },
    { icon: 'call-outline', label: 'Changer de numéro principal' },
    { icon: 'log-out-outline', label: 'Se déconnecter', danger: true },
  ];
  constructor(private location: Location, private router: Router) {}
  goBack() { this.location.back(); }
  logout() { this.router.navigate(['/splash'], { replaceUrl: true }); }
}
