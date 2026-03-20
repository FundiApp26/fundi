import { Injectable } from '@angular/core';
import { Observable, from, tap, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

export interface AuthUser {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  omNumber?: string;
  momoNumber?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface OtpResponse {
  message: string;
  expiresIn: number;
}

export interface VerifyOtpResponse {
  verified: boolean;
  isNewUser: boolean;
  phone: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'fundi_access_token';
  private readonly REFRESH_TOKEN_KEY = 'fundi_refresh_token';
  private readonly USER_KEY = 'fundi_user';

  constructor(private api: ApiService, private storage: StorageService) {}

  // Phone verify page
  sendOtp(phone: string): Observable<OtpResponse> {
    return this.api.post<OtpResponse>('auth/send-otp', { phone });
  }

  // OTP verify page
  verifyOtp(phone: string, code: string): Observable<VerifyOtpResponse> {
    return this.api.post<VerifyOtpResponse>('auth/verify-otp', { phone, code });
  }

  // Profile setup + MoMo setup + PIN setup → register
  register(data: {
    phone: string; firstName: string; lastName?: string; avatarUrl?: string;
    omNumber?: string; omConfirmName?: string; momoNumber?: string; momoConfirmName?: string;
    pin: string;
  }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', data).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  // PIN login page
  login(phone: string, pin: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', { phone, pin }).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  // Forgot password
  forgotPassword(phone: string): Observable<any> {
    return this.api.post('auth/forgot-password', { phone });
  }

  resetPassword(phone: string, code: string, newPin: string): Observable<any> {
    return this.api.post('auth/reset-password', { phone, code, newPin });
  }

  // Refresh token
  refreshToken(): Observable<{ accessToken: string }> {
    return from(this.storage.get(this.REFRESH_TOKEN_KEY)).pipe(
      switchMap(refreshToken =>
        this.api.post<{ accessToken: string }>('auth/refresh', { refreshToken })
      ),
      tap(res => this.storage.set(this.TOKEN_KEY, res.accessToken))
    );
  }

  logout(): Observable<void> {
    return from(this.storage.remove(this.TOKEN_KEY)).pipe(
      switchMap(() => from(this.storage.remove(this.REFRESH_TOKEN_KEY))),
      switchMap(() => from(this.storage.remove(this.USER_KEY))),
    );
  }

  getToken(): Promise<string | null> {
    return this.storage.get(this.TOKEN_KEY);
  }

  async getUser(): Promise<AuthUser | null> {
    const val = await this.storage.get(this.USER_KEY);
    return val ? JSON.parse(val) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.getToken());
  }

  private saveAuth(res: AuthResponse) {
    this.storage.set(this.TOKEN_KEY, res.accessToken);
    this.storage.set(this.REFRESH_TOKEN_KEY, res.refreshToken);
    this.storage.set(this.USER_KEY, JSON.stringify(res.user));
  }
}
