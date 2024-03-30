import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
  selector: 'app-ubicacion-form',
  templateUrl: './ubicacion-form.component.html',
  styleUrls: ['./ubicacion-form.component.css']
})
export class UbicacionFormComponent implements OnInit {

  @Input()
  ubicacion: UbicacionModel = new UbicacionModel();
  @Output() 
  eventoEmiteCierraFormUbi = new EventEmitter<boolean>();

  //showP2:boolean = false;
  titulo:string = "";
  textBtn:string = "";
  private paramId : string = "";

  constructor( 
    private resApi:ApiResponseService, 
    private actRoute:ActivatedRoute, 
    private ubiServ:UbicacionService) {
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
        this.titulo = "Nueva ubicación";
        this.textBtn = "Registrar ubicación"
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
    if(!form.valid || this.ubicacion.titulo == "-" || this.ubicacion.descripcion == "-" || 
      this.ubicacion.longitud == 0 || this.ubicacion.latitud == 0){
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

    //console.log("ubicación nueva: " + this.ubicacion);
    this.emiteCierraVentana();
    this.ubiServ.postUbi(localStorage.getItem('token')!, this.ubicacion).subscribe(res => {
      switch(res.status) { 
        case 201: { 
          this.resApi.resMensajeSucBtn('ubicación creado con éxito');
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
    this.eventoEmiteCierraFormUbi.emit(false);
  }
}
