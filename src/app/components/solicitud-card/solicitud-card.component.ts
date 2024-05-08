import { Component, Input, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-solicitud-card',
  templateUrl: './solicitud-card.component.html',
  styleUrls: ['./solicitud-card.component.css']
})
export class SolicitudCardComponent implements OnInit {

  @Input() solicitud:SolicitudModel = new SolicitudModel();
  @Input() index:number = 0;

  visible = false;
  tareaTit ="";
  botonAprobar="";
  botonRechazar="";

  private permisos = [ "ADMIN", "Director",  "RRHH",  "Gerente", "Comercial", "Supervisor", "Gestor", "Capataz", "Coordinador" ];
  
  constructor(private solServ:SolicitudService,
    private tarServ:TareaService, 
    private apiRespServ:ApiResponseService,
    private locServ:LocalizationService) { 

    
    /*if(this.solicitud.tarea.descripcion.length > 50){
      this.solicitud.tarea.descripcion = (this.solicitud.tarea.descripcion.slice(0,50) + "...");
    }*/
  }
  ngOnInit(): void {
    this.inicia();
    if(this.visible){
      this.locServ.getString("botones.rechazar").subscribe(val => this.botonRechazar = val);
      this.locServ.getString("botones.aprobar").subscribe(val => this.botonAprobar = val);
    }else{
      this.locServ.getString("botones.eliminar").subscribe(val => this.botonRechazar = val);
    }
  }
  private inicia(){console.log(this.solicitud);
    this.visible = this.permisos.includes(localStorage.getItem('rol')!);
    //console.log(rol, this.visible);
    this.tarServ.getTareaById(localStorage.getItem("token")!,this.solicitud.idTarea).subscribe({next:res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);

      }else{
        this.tareaTit = (res as TareaModel).nombre;
      }
    },error:err=>console.log(err)});
  }
  eliminaSolicitud(){
    this.eliminaSolicitudPri();
  }
  private eliminaSolicitudPri(){
    this.solServ.deleteSolicitud(localStorage.getItem("token")!,this.solicitud._id).subscribe({
      next:val=>{
        if(val.status < 220){
          if(this.visible){
            this.locServ.getString("mensajesInformacion.202rechazaSolicitud")
              .subscribe(val => this.apiRespServ.resMensajeSucBtn(val,true));
          }else{
            this.locServ.getString("mensajesInformacion.202deleteSolicitud")
              .subscribe(val => this.apiRespServ.resMensajeSucBtn(val,true));
          }
        }else{
          console.log("Error: ", val.message);
        }
      }, 
      error:err=>console.log("Error: ",err)}
    );
  }
  aprobarSolicitud(){
    this.aprobarSolicitudPri();
  }
  private aprobarSolicitudPri(){
    this.tarServ.postEmpleadoATarea(localStorage.getItem("token")!,
    this.solicitud.idTarea,this.solicitud.idEmpleado,this.solicitud._id)
    .subscribe({next:res=>console.log(res.message),error:err=> console.log(err)});
  }
}