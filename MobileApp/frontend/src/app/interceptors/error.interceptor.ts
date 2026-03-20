import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(StorageService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Token expired or invalid - clear storage and redirect to login
        storage.remove('fundi_access_token');
        storage.remove('fundi_refresh_token');
        storage.remove('fundi_user');
        router.navigate(['/splash']);
      }

      if (error.status === 0) {
        console.error('Network error - server may be unreachable');
      }

      return throwError(() => error);
    })
  );
};
