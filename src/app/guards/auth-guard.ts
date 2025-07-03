import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  CanActivateChild,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.checkLogin();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkLogin();
  }

  private checkLogin(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token && !this.isTokenExpired(token)) {
      return true;
    }
    return this.router.parseUrl('/login'); 
  }
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return now > exp;
    } catch (e) {
      return true;
    }
  }
}
