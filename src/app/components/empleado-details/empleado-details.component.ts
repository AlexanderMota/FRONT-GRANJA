import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { TareaService } from 'src/app/services/tarea.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-empleado-details',
  templateUrl: './empleado-details.component.html',
  styleUrls: ['./empleado-details.component.css']
})
export class EmpleadoDetailsComponent implements OnInit {

  empleado: EmpleadoModel = new EmpleadoModel();
  tareas:TareaModel[]=[];
  constructor(private empServ:EmpleadoService, 
    private tarServ:TareaService, 
    private vehiServ:VehiculoService, 
    private resPop:ApiResponseService,
    private locServ: LocalizationService, 
    private actRoute:ActivatedRoute) {
    this.actRoute.params.subscribe(async params=>{
      //console.log(params);
        if(params['id']){
          this.empServ.getEmpleadoById(localStorage.getItem('token')!, params['id']).subscribe({next:res2 => {
            console.log(res2);
            this.empleado = res2;
          },error: err =>console.log(err)});

          this.tarServ.getTareaByIdEmpleado(localStorage.getItem('token')!, params['id']).subscribe({next:(res) => {

            this.tareas = res;
            //console.log(this.solicitudes);
          }, error:(err) => {
            switch (err.error.status) {
              case 401: {
                this.locServ.getString("mensajesInformacion.sesionExpirada").subscribe(val => this.resPop.resMensajeErrBtnRedir(val, "/")
                );
                break;
              }
              case 404: {
                this.locServ.getString("mensajesError.nombreEmpleadoNoExiste").subscribe(val => this.resPop.resMensajeErrBtn(val));
                break;
              }
              case 0: {
                this.locServ.getString("mensajesError.desconocido").subscribe(val => this.resPop.resMensajeWrnBtn(val));
                break;
              }
              default: {
                //statements; 
                break;
              }
            }
          }});

          this.vehiServ.getVehiculosByPropietario(localStorage.getItem("token")!,params['id']).subscribe({next:val=>{
            console.log(val);
          },error:err=>{
            console.log(err);
          }});
        }
    }); 
  }

  ngOnInit(): void {
  }
}
