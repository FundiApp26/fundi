import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [authGuard]
  },

  // Onboarding (no auth required)
  {
    path: 'splash',
    loadChildren: () => import('./pages/onboarding/splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/slides/slides.module').then(m => m.SlidesPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/onboarding/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'phone-verify',
    loadChildren: () => import('./pages/onboarding/phone-verify/phone-verify.module').then(m => m.PhoneVerifyPageModule)
  },
  {
    path: 'profile-setup',
    loadChildren: () => import('./pages/onboarding/profile-setup/profile-setup.module').then(m => m.ProfileSetupPageModule)
  },
  {
    path: 'momo-setup',
    loadChildren: () => import('./pages/onboarding/momo-setup/momo-setup.module').then(m => m.MomoSetupPageModule)
  },
  {
    path: 'otp-verify',
    loadChildren: () => import('./pages/onboarding/otp-verify/otp-verify.module').then(m => m.OtpVerifyPageModule)
  },
  {
    path: 'pin-setup',
    loadChildren: () => import('./pages/onboarding/pin-setup/pin-setup.module').then(m => m.PinSetupPageModule)
  },
  {
    path: 'pin-login',
    loadChildren: () => import('./pages/onboarding/pin-login/pin-login.module').then(m => m.PinLoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/onboarding/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },

  // Cotisation
  {
    path: 'cotisation/create',
    loadChildren: () => import('./pages/cotisation/create/create.module').then(m => m.CreatePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'cotisation/chat',
    loadChildren: () => import('./pages/cotisation/chat/chat.module').then(m => m.ChatPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'cotisation/members-list',
    loadChildren: () => import('./pages/cotisation/members-list/members-list.module').then(m => m.MembersListPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'cotisation/payment-tracking',
    loadChildren: () => import('./pages/cotisation/payment-tracking/payment-tracking.module').then(m => m.PaymentTrackingPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'cotisation/calendar',
    loadChildren: () => import('./pages/cotisation/calendar/calendar.module').then(m => m.CalendarPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'cotisation/payment-form',
    loadChildren: () => import('./pages/cotisation/payment-form/payment-form.module').then(m => m.PaymentFormPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'cotisation/manual-payment',
    loadChildren: () => import('./pages/cotisation/manual-payment/manual-payment.module').then(m => m.ManualPaymentPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'cotisation/history',
    loadChildren: () => import('./pages/cotisation/history/history.module').then(m => m.HistoryPageModule),
    canActivate: [authGuard]
  },

  // Discussion
  {
    path: 'discussion/new',
    loadChildren: () => import('./pages/discussion/new-discussion/new-discussion.module').then(m => m.NewDiscussionPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'discussion/chat',
    loadChildren: () => import('./pages/discussion/chat/chat.module').then(m => m.ChatPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'discussion/send-money',
    loadChildren: () => import('./pages/discussion/send-money/send-money.module').then(m => m.SendMoneyPageModule),
    canActivate: [authGuard]
  },

  // Profile
  {
    path: 'profile/my-profile',
    loadChildren: () => import('./pages/profile/my-profile/my-profile.module').then(m => m.MyProfilePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'profile/user-profile',
    loadChildren: () => import('./pages/profile/user-profile/user-profile.module').then(m => m.UserProfilePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'profile/edit-profile',
    loadChildren: () => import('./pages/profile/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule),
    canActivate: [authGuard]
  },

  // Notifications
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [authGuard]
  },
  // About
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule),
    canActivate: [authGuard]
  },
  // History Transactions
  {
    path: 'history-transactions',
    loadChildren: () => import('./pages/history-transactions/history-transactions.module').then(m => m.HistoryTransactionsPageModule),
    canActivate: [authGuard]
  },
  // Premium
  {
    path: 'premium',
    loadChildren: () => import('./pages/premium/premium/premium.module').then(m => m.PremiumPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'premium/ad-reward',
    loadChildren: () => import('./pages/premium/ad-reward/ad-reward.module').then(m => m.AdRewardPageModule),
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
