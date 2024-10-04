import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = localStorage.getItem('role');
    console.log(state.url);
    const adminOnlyRoutes = ['/product/add', '/product/low-stock'];
    const userOnlyRoutes=['/address', '/address/new']
    const isProductUpdateRoute = state.url.startsWith('/product/update');
    if ((adminOnlyRoutes.includes(state.url) || isProductUpdateRoute) && role !== 'ADMIN') {
      this.router.navigate(['/pageNotFound']); 
      return false;
    }
    if ((adminOnlyRoutes.includes(state.url) || isProductUpdateRoute) && role === 'ADMIN') {
      return true;
    }
    if (userOnlyRoutes.includes(state.url) && role !== 'USER') {
      this.router.navigate(['/pageNotFound']);  
      return false;
    }
    if (userOnlyRoutes.includes(state.url) && role === 'USER') {
      return true;
    }
    return true;
  }
}
