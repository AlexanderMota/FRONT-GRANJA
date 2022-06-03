import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-empleado-details',
  templateUrl: './empleado-details.component.html',
  styleUrls: ['./empleado-details.component.css']
})
export class EmpleadoDetailsComponent implements OnInit {

  empleado: EmpleadoModel = new EmpleadoModel();
  tareas:TareaModel[]=[];
  constructor(private empServ:EmpleadoService, private tarServ:TareaService, private resPop:ApiResponseService, private actRoute:ActivatedRoute) {
    this.actRoute.params.subscribe(async params=>{
      //console.log(params);
        if(params['id']){
          await this.tarServ.getTareaByIdEmpleado(localStorage.getItem('token')!,params['id']).subscribe(res=>{
            //console.log("res tareas: " + res);
            this.tareas = res;
            //console.log(this.solicitudes);
          },(err)=>{
            switch(err.error.status) { 
              case 401: { 
                
                this.resPop.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
                
                 break; 
              } 
              case 404: { 
                this.resPop.resMensajeErrBtn("No hay usuarios con ese nombre.");
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
          });
          await this.empServ.getEmpleadoById(localStorage.getItem('token')!,params['id'])
          .subscribe(res2=>{
            this.empleado=res2;
          });
        }else{
          
        }
      }); 
    }

  ngOnInit(): void {
  }

}
