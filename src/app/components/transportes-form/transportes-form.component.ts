import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-transportes-form',
  templateUrl: './transportes-form.component.html',
  styleUrls: ['./transportes-form.component.css']
})
export class TransportesFormComponent implements OnInit {

  @Output() 
  eventoEmiteCierraFormVehi = new EventEmitter<boolean>();

  private rol="";
  private permisos = ["ADMIN", "Director", "RRHH","Gerente"];
  visible = false;
  vehiculo: VehiculoModel = new VehiculoModel();
  titulo:string = "";
  textBtn:string = "";
  //private paramId : string = "";

  constructor( 
    private resApi:ApiResponseService, 
    private actRoute:ActivatedRoute, 
    private vehiServ:VehiculoService,
    private localizationService:LocalizationService ) {
    //this.actRoute.params.subscribe(params=>{
      this.localizationService.getString("encabezados.guardaVehiculo").subscribe(val=>this.titulo = val);
      this.localizationService.getString("botones.nuevoVehiculo").subscribe(val=>this.textBtn = val);
    //}); 
  }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!;
    this.visible = this.permisos.includes(this.rol);
  }
  onSubmit(form:NgForm){
    if(!this.visible){
      this.vehiculo.propietario = localStorage.getItem("miid")!;
      console.log(this.vehiculo.propietario);
    }
    if(!form.valid || this.vehiculo.matricula == "-" || this.vehiculo.propietario == "" || this.vehiculo.descripcion== "-"){
      return;
    }
    this.resApi.resCargando('Espere...');
    /*if(this.paramId.length > 0){
      this.vehiServ.patchTarea(localStorage.getItem('token')!, this.vehiculo!).subscribe(res => {
        switch(res.status) { 
          case 201: { 
            this.resApi.resMensajeSucBtn('Tarea creada con éxito');
             break; 
          }
          case 202: { 
            this.resApi.resMensajeSucBtn('Tarea modificada con éxito');
             break; 
          }
          case 0: { 
            this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
             break; 
          } 
          default: { 
             break; 
          } 
        }
      },(err)=>{
        this.resApi.resMensajeErrBtn(err.error.message);
      });
      
    }else*/
    console.log(this.vehiculo);
    this.vehiServ.postVehiculo(localStorage.getItem('token')!, this.vehiculo ,).subscribe({next:(res) => {
      switch(res.status) { 
        case 201: { 
          this.resApi.resMensajeSucBtn('Vehículo creado con éxito');
            break; 
        }
        case 400: { 
          this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
            break; 
        } 
        default: { 
            //statements; 
            break; 
        } 
      } 
    },error:(err)=>{
      this.resApi.resMensajeErrBtn(err.error.message);
    }});
    
    this.emiteCierraVentana();
  }
  emiteCierraVentana(){
    this.eventoEmiteCierraFormVehi.emit(false);
  }
}
