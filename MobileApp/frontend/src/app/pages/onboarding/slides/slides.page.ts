import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  standalone: false,
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements AfterViewInit {
  @ViewChild('swiper') swiperRef!: ElementRef;
  activeIndex = 0;

  slides = [
    { title: 'Recevez votre argent directement sur vos comptes OM et MOMO', icon: 'assets/illustrations/onboarding-1-money.png' },
    { title: "Consultez l'historique de cotisation des nouveaux adhérents et leur crédibilité", icon: 'assets/illustrations/onboarding-2-checklist.png' },
    { title: 'Vérifiez les listes qui se cochent automatiquement après chaque dépôt', icon: 'assets/illustrations/onboarding-3-document.png' },
    { title: 'Cotisez plus rapidement et plus simplement, en cliquant sur un bouton', icon: 'assets/illustrations/onboarding-4-clock.png' },
  ];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement;
    Object.assign(swiperEl, {
      slidesPerView: 1,
      pagination: false,
      on: { slideChange: () => { this.activeIndex = swiperEl.swiper.activeIndex; } }
    });
    swiperEl.initialize();
  }

  skip() { this.router.navigate(['/welcome'], { replaceUrl: true }); }
}
