import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html'
})
export class SolicitudComponent /*implements OnInit*/ {

  solicitud:SolicitudModel=new SolicitudModel();
  private solId:string ="";
  constructor(private solServ:SolicitudService, private actRoute:ActivatedRoute, private resPop: ApiResponseService) { 
    this.actRoute.params.subscribe(params=>{
      console.log(params);
      solServ.getSolicitudById(localStorage.getItem('token')!,params['id']).subscribe(res=>{
        if(res instanceof ApiResponse){
          console.log(res.message);
        }else{
          this.solicitud=res;
        }
        this.solId=params['id'];
      console.log(this.solicitud);
      });
    });
  }

  /*ngOnInit(): void {
  }*/
  agregaEmpleadoaTarea(){
    this.resPop.resCargando('Espere...');
    this.solServ.postEmpleadoATarea(
      localStorage.getItem('token')!,
      this.solicitud.empleado._id,
      this.solicitud.tarea._id, this.solId
    ).subscribe(res=>{
        console.log("respuesta back: "+res);
        switch(res.status) {
          case 201: {
            Swal.close();
            this.resPop.resMensajeSucBtn("Tarea asignada al empleado.");
            break;
          
          }
          case 403: {
            Swal.close();
            this.resPop.resMensajeErrBtn("El empleado no se pudo registrar para la tarea.");
            break;
          
          }
        }
      },(err)=>{
        this.resPop.resMensajeErrBtn(err.error.status+': '+err.error.message);
      /*switch(err.error.status) {
        case 400: {
          this.resPop.resMensajeErrBtn('Uno de los parametros es erroneo.');
           break;
        }
        case 402: {
          this.resPop.resMensajeErrBtn(err.error.message);
           break;
        }
        case 404: { 
          this.resPop.resMensajeErrBtn('No hay usuarios con ese nombre.');
           break; 
        } 
        case 0: {
          this.resPop.resMensajeWrnBtn('Algo ha ido mal.');
           break; 
        }
        default: { 
           //statements; 
           break; 
        }
      } */ 
    });
  }
  rechazarSolicitud(){
    console.log("idSolicitud > "+this.solicitud.idSolicitud)
    this.resPop.resCargando('Espere...');
    this.solServ.deleteSolicitud(
      localStorage.getItem('token')!,
      this.solicitud.idSolicitud,
    ).subscribe(res=>{
        console.log("respuesta back: "+res);
        switch(res.status) {
          case 201: {
            Swal.close();
            this.resPop.resMensajeWrnBtnRedir("Solicitud rechazada con éxito.","solicitudes");
            break;
          
          }
          case 403: {
            Swal.close();
            this.resPop.resMensajeErrBtn("La solicitud no se pudo rechazar.");
            break;
          
          }
        }
      },(err)=>{
        this.resPop.resMensajeErrBtn(err.error.status+': '+err.error.message);
    });
  }
}