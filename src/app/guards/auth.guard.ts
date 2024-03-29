import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private autServ:AuthService, private router: Router){
  }
  
  canActivate():boolean {
    if(this.autServ.esAutenticado()){
      return true;
    }else{
      this.router.navigateByUrl('/login');
      return false
    }
  }
}
