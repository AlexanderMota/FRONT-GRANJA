import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { AuthService } from 'src/app/services/auth.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers:[AuthService]
})
export class NavbarComponent implements OnInit {
  autenticado = false;
  supertareas: TareaModel[] = [];

  constructor(private auth:AuthService, private route:Router, private tarServ:TareaService) { 
    this.autenticado = this.auth.esAutenticado();
  }

  ngOnInit(): void {
    this.autenticado = this.auth.esAutenticado();
    if(this.autenticado){
      this.tarServ.getSuperTareas(localStorage.getItem('token')!).subscribe(async res => {
        this.supertareas = res;
        console.log(this.supertareas);
      });
    }
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
