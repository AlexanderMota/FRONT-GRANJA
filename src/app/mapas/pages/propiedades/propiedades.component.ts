import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styles: [
  ]
})

export class PropiedadesComponent implements OnInit {

  ubis : UbicacionModel[] = [];

  constructor( 
    private ubiServ:UbicacionService,
    private auth:AuthService,
    private resPop:ApiResponseService ) { }
   
  ngOnInit(): void {
    this.ubiServ.getAllUbicaciones(localStorage.getItem('token')!).subscribe({next:res=>{
      if(res instanceof ApiResponse){
        console.log(res.message);
      }else{
        this.ubis = res.sort();
      }
    },error:(err)=>{
      switch(err.error.status) { 
        case 401: { this.auth.logout();
          
          this.resPop.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
          this.auth.logout();
           break; 
        } 
        case 404: { 
          this.resPop.resMensajeErrBtn("No hay ubicaciones.");
           break; 
        } 
        case 0: { 
          this.resPop.resMensajeWrnBtn("Algo ha ido mal.");
           break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
      } 
    }});
  }
}
