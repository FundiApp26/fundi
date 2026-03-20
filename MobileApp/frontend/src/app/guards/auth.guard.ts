import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = async () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const token = await storage.get('fundi_access_token');

  if (token) {
    return true;
  }

  router.navigate(['/splash']);
  return false;
};
