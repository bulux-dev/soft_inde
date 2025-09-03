import { CanActivateFn } from '@angular/router';
import * as jwt from 'jwt-decode';

export const AdminGuard: CanActivateFn = (route, state) => {
  try {
    let token: any = localStorage.getItem('token');    
    jwt.jwtDecode(token);
  } catch (error) {
    return false;
  }
  return true;
};
