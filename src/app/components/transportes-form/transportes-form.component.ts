import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-transportes-form',
  templateUrl: './transportes-form.component.html',
  styleUrls: ['./transportes-form.component.css']
})
export class TransportesFormComponent implements OnInit {

  @Output() 
  eventoEmiteCierraFormVehi = new EventEmitter<boolean>();

  //showP2:boolean = false;
  vehiculo: VehiculoModel = new VehiculoModel();
  titulo:string = "";
  textBtn:string = "";
  private paramId : string = "";

  constructor( 
    private resApi:ApiResponseService, 
    private actRoute:ActivatedRoute, 
    private vehiServ:VehiculoService ) {
    this.actRoute.params.subscribe(params=>{
      //console.log(params['id']);
      /*if(params['id']){
        this.titulo = "Edita vehículo";
        this.textBtn = "Guardar cambios"
        this.paramId = params['id'];
        //console.log("contructor route paramid=>\n"+this.paramId);
        vehiServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
          this.vehiculo=res;
          //console.log("contructor route params=>\n"+res);
        });
      }else{*/
        this.titulo = "Nuevo vehiculo";
        this.textBtn = "Registrar vehiculo"
        /*vehiServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
          this.supers.push(res);
          //console.log("contructor route params=>\n"+res);
        });*/
      //}
      
    }); 
  }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm){
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

    console.log("vehiculo nuevo: " + this.vehiculo.matricula);
    this.vehiServ.postVehiculo(localStorage.getItem('token')!, this.vehiculo ,).subscribe(res => {
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
    },(err)=>{
      this.resApi.resMensajeErrBtn(err.error.message);
    });
    
    this.emiteCierraVentana();
  }
  emiteCierraVentana(){
    this.eventoEmiteCierraFormVehi.emit(false);
  }
}
