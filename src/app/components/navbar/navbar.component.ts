import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers:[AuthService]
})
export class NavbarComponent implements OnInit {
  autenticado = false;
  constructor(private auth:AuthService, private route:Router) { 
    this.autenticado = this.auth.esAutenticado();
  }

  ngOnInit(): void {
    this.autenticado = this.auth.esAutenticado();
  }

  /*navAuth(){
    if(this.auth.esAutenticado()){
      this.vis = "visible";
    }else{
      this.vis = "hidden";
    }
  }*/
  busca(str:string){
    console.log(str);
  }
  logout(){
    this.auth.logout();
    this.route.navigateByUrl('/login');
    this.autenticado = false;
  }
}
