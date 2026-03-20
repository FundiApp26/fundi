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
    {
      title: 'Recevez votre argent directement sur vos comptes OM et MOMO',
    },
    {
      title: "Consultez l'historique de cotisation des nouveaux adhérents et leur crédibilité",
    },
    {
      title: 'Vérifiez les listes qui se cochent automatiquement après chaque dépôt',
    },
    {
      title: 'Cotisez plus rapidement et plus simplement, en cliquant sur un bouton',
    }
  ];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement;
    const params = {
      slidesPerView: 1,
      pagination: false,
      on: {
        slideChange: () => {
          this.activeIndex = swiperEl.swiper.activeIndex;
        }
      }
    };
    Object.assign(swiperEl, params);
    swiperEl.initialize();
  }

  skip() {
    this.router.navigate(['/welcome'], { replaceUrl: true });
  }

  next() {
    const swiperEl = this.swiperRef.nativeElement;
    if (this.activeIndex < this.slides.length - 1) {
      swiperEl.swiper.slideNext();
    } else {
      this.skip();
    }
  }
}
