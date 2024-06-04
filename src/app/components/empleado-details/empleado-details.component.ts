import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { TareaService } from 'src/app/services/tarea.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-empleado-details',
  templateUrl: './empleado-details.component.html',
  styleUrls: ['./empleado-details.component.css']
})
export class EmpleadoDetailsComponent implements OnInit {

  empleado: EmpleadoModel = new EmpleadoModel();
  tareas:TareaModel[]=[];
  vehiculos:VehiculoModel[]=[];
  vehisComp:VehiculoModel[]=[];
  constructor(private empServ:EmpleadoService, 
    private tarServ:TareaService, 
    private vehiServ:VehiculoService, 
    private resPop:ApiResponseService,
    private locServ: LocalizationService, 
    private actRoute:ActivatedRoute,
    private ubiServ: UbicacionService) {
    this.actRoute.params.subscribe(async params=>{
        if(params['id']){
          this.empServ.getEmpleadoById(localStorage.getItem('token')!, params['id']).subscribe({next:res2 => {
            console.log(res2);
            if((res2 as ApiResponse).status){
              console.log((res2 as ApiResponse).message);
            }else{
              this.empleado = res2 as EmpleadoModel;

              this.ubiServ.getMisParadas(localStorage.getItem('token')!,this.empleado._id).subscribe({next:res4=>{
                
                console.log(res4);
                if((res4 as ApiResponse).status){
                  console.log((res4 as ApiResponse).message);
                }else{
                  console.log("response mis paradas");
                  /*(res4 as any[]).forEach(val => {
                    console.log("sfgdsfg");
                    console.log(val);
                  });*/
                }
              },error:err=>console.log(err)});
            }
          },error: err =>console.log(err)});

          this.tarServ.getTareaByIdEmpleado(localStorage.getItem('token')!, params['id']).subscribe({next:(res) => {
            if((res as ApiResponse).status){
              console.log((res as ApiResponse).message);
            }else{
              this.tareas = res as TareaModel[];
            }
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
            if((val as ApiResponse).status) console.log((val as ApiResponse).message);
            else this.vehiculos = val as VehiculoModel[];
          },error:err=> console.log(err)});
          
        }
    }); 
  }

  ngOnInit(): void {
  }
}
