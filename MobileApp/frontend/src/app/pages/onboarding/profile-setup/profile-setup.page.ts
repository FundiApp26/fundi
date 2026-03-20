import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.page.html',
  standalone: false,
  styleUrls: ['./profile-setup.page.scss'],
})
export class ProfileSetupPage {
  nom = '';
  prenom = '';
  photoUrl: string | null = null;

  constructor(
    private router: Router,
    private location: Location,
    private actionSheetCtrl: ActionSheetController,
    private storage: StorageService
  ) {}

  goBack() {
    this.location.back();
  }

  async pickPhoto() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Photo de profil',
      buttons: [
        {
          text: 'Prendre une photo',
          icon: 'camera-outline',
          handler: () => this.takePhoto(CameraSource.Camera),
        },
        {
          text: 'Choisir depuis la galerie',
          icon: 'image-outline',
          handler: () => this.takePhoto(CameraSource.Photos),
        },
        { text: 'Annuler', role: 'cancel', icon: 'close-outline' },
      ],
    });
    await actionSheet.present();
  }

  async takePhoto(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source,
        width: 400,
        height: 400,
      });
      this.photoUrl = image.dataUrl || null;
    } catch (e) {
      console.log('Camera cancelled', e);
    }
  }

  async onNext() {
    if (this.nom.trim()) {
      await this.storage.set('fundi_setup_nom', this.nom.trim());
      await this.storage.set('fundi_setup_prenom', this.prenom.trim());
      if (this.photoUrl) {
        await this.storage.set('fundi_setup_photo', this.photoUrl);
      }
      this.router.navigate(['/momo-setup'], { replaceUrl: true });
    }
  }
}
