import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers:[AuthService]
})
export class NavbarComponent implements OnInit {
  visible = false;
  autenticado = false;
  supertareas: TareaModel[] = [];

  val1 ="";
  val2 ="";
  val3 ="";
  val4 ="";
  val5 ="";
  val6 ="";

  private rol="";
  private permisos = ["ADMIN", "Director", "RRHH","Gerente"];

  constructor(private autServ:AuthService, 
    private route:Router, 
    private tarServ:TareaService,
    private localizationService:LocalizationService) { 
    
    this.autenticado = this.autServ.esAutenticado();

    this.localizationService.getString("botones.nav1").subscribe(val => this.val1=val);
    this.localizationService.getString("botones.nav2").subscribe(val => this.val2=val);
    this.localizationService.getString("botones.nav3").subscribe(val => this.val3=val);
    this.localizationService.getString("botones.nav4").subscribe(val => this.val4=val);
    this.localizationService.getString("botones.nav5").subscribe(val => this.val5=val);
    this.localizationService.getString("botones.nav6").subscribe(val => this.val6=val);
    
  }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!;
    this.visible = this.permisos.includes(this.rol);
    this.autenticado = this.autServ.esAutenticado();
    if(this.autenticado){
      this.tarServ.getSuperTareas(localStorage.getItem('token')!).subscribe(async res => {
        if(res as ApiResponse){
          console.log((res as ApiResponse).message);
        }else{
          this.supertareas = res as [TareaModel];
        }
        //console.log(this.supertareas);
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
    this.autServ.logout();
    this.route.navigateByUrl('/login');
    this.autenticado = false;
    localStorage.setItem('centroActual',"");
  }
  guardaCentro(centro:string){
    localStorage.setItem('centroActual', centro);
    location.reload();
  }
}
