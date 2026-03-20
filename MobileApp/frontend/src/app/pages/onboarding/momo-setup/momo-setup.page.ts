import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-momo-setup',
  templateUrl: './momo-setup.page.html',
  standalone: false,
  styleUrls: ['./momo-setup.page.scss'],
})
export class MomoSetupPage {
  omNumber = '';
  omName = '';
  momoNumber = '';
  momoName = '';

  constructor(private router: Router, private location: Location, private storage: StorageService) {}

  goBack() { this.location.back(); }

  async onValidate() {
    await this.storage.set('fundi_setup_om_number', this.omNumber ? '+237' + this.omNumber : '');
    await this.storage.set('fundi_setup_om_name', this.omName);
    await this.storage.set('fundi_setup_momo_number', this.momoNumber ? '+237' + this.momoNumber : '');
    await this.storage.set('fundi_setup_momo_name', this.momoName);
    this.router.navigate(['/pin-setup'], { replaceUrl: true });
  }
}
