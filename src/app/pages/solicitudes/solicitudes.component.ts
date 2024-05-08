import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  titulo="Solicitudes";
  posttitulo="Lista de empleados interesados en tareas";
  solicitudes:SolicitudModel[] = [];

  constructor(private solServ:SolicitudService,
          private authServ:AuthService,
          private respServ:ApiResponseService
          /*private router:Router,*/) { }

  ngOnInit(): void {
    //console.log(this.auth.token);
    this.solServ.getAllSolicitudes(localStorage.getItem('token')!).subscribe({next:res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
        if((res as ApiResponse).status == 420){
          this.authServ.logout();
          this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
          this.authServ.logout();
        }
      }else if((res as SolicitudModel[]).length > 0){
        this.solicitudes = res as SolicitudModel[];
      }
      //console.log(this.empleados);
    },error:err=>{
      switch(err.error.status) { 
        case 420: { 
          this.authServ.logout();
          this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
          this.authServ.logout();
          break; 
        } 
        /*case 404: { 
          this.respServ.resMensajeErrBtn("No hay tareas en este centro.");
            break; 
        } */
        default: { 
          this.respServ.resMensajeWrnBtn("Algo ha ido mal.");
            //statements; 
            break; 
        } 
      } 
    }});
  }
}
