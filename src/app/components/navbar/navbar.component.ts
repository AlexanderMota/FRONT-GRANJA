import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  providers:[AuthService]
})
export class NavbarComponent implements OnInit {
  //@Input()
  perfil = "";
  visible = false;
  showP = false;
  autenticado = false;
  supertareas: TareaModel[] = [];

  val1 ="";
  val2 ="";
  val3 ="";
  val4 ="";
  val5 ="";
  val6 ="";
  centro ="0b1c";

  private rol="";
  private permisos = ["ADMIN", "Director", "RRHH","Gerente"];

  constructor(private authServ:AuthService, 
    private route:Router, 
    private tarServ:TareaService, 
    private respServ:ApiResponseService,
    private localizationService:LocalizationService) { 

    this.localizationService.getString("botones.nav1").subscribe(val => this.val1=val);
    this.localizationService.getString("botones.nav2").subscribe(val => this.val2=val);
    this.localizationService.getString("botones.nav3").subscribe(val => this.val3=val);
    this.localizationService.getString("botones.nav4").subscribe(val => this.val4=val);
    this.localizationService.getString("botones.nav5").subscribe(val => this.val5=val);
    this.localizationService.getString("botones.nav6").subscribe(val => this.val6=val);
  }

  ngOnInit(): void {   
    this.autenticado = this.authServ.esAutenticado();
    this.rol = localStorage.getItem('rol')!;
    this.visible = this.permisos.includes(this.rol);
    this.autenticado = this.authServ.esAutenticado();
    this.perfil = localStorage.getItem("miid")!;
    if(this.autenticado){
      this.tarServ.getSuperTareas(localStorage.getItem('token')!).subscribe(async res => {
        if((res as ApiResponse).status){
          if((res as ApiResponse).status == 420){
            this.authServ.logout();
            this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
            this.authServ.logout();
          }else console.log((res as ApiResponse).message);
        }else this.supertareas = res as TareaModel[];
      });
    }else{
      this.authServ.logout();
      this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
      this.authServ.logout();
    }
  }
  logout(){
    this.authServ.logout();
    this.autenticado = false;
    localStorage.setItem('centroActual',"");
    localStorage.setItem('miid',"");
    this.route.navigateByUrl('/login');
  }
  guardaCentro(centro:string){
    localStorage.setItem('centroActual', centro);
    location.reload();
  }
  creaCentro(){
    this.respServ.resMensajeQuesBtnCancBtn("ATENCIÓN","Se dispone a crear un nuevo centro de trabajo ¿Desea continuar?","Continuar",true,"Cancelar").then(val =>{
      this.showP = val.isConfirmed;
    });
  }
  receiveMessageCierraFormCentro($event:boolean){
    this.showP = $event;
  }
}
