import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { VehiculoModel } from 'src/app/models/vehiculo.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-ubicacion-form',
  templateUrl: './ubicacion-form.component.html',
  styleUrls: ['./ubicacion-form.component.css']
})
export class UbicacionFormComponent implements OnInit {

  @Input()
  ubicacion: UbicacionModel = new UbicacionModel();
  @Input()
  idDestino = "";
  @Output() 
  eventoEmiteCierraFormUbi = new EventEmitter<boolean>();

  nuevaUbiTarea = false;
  titulo:string = "";
  textBtn:string = "";
  coches: {matricula:string,plazas:number}[]=[];
  fechaRecogida={fechaInicio:new Date,fechaFin:new Date,vehiculo:""};

  constructor( 
    private resApi:ApiResponseService, 
    private ubiServ:UbicacionService,
    private vehiServ:VehiculoService,
    private localizationService: LocalizationService) {

    this.vehiServ.getVehiculosByPropietario(
      localStorage.getItem("token")!,
      localStorage.getItem("miid")!)
    .subscribe(res => {
      if((res as ApiResponse).status) console.log((res as ApiResponse).message);
      else (res as [VehiculoModel]).forEach(dat =>{
        this.coches[this.coches.length] = {matricula:dat.matricula,plazas:dat.plazas-(dat.ocupantes.length + 1)};
        //}
      });
    });
  }

  ngOnInit(): void {
    this.ubicacion.fechasRecogida[0] = {fechaInicio:new Date,fechaFin:new Date,vehiculo:""};
    if(this.ubicacion._id){
      this.localizationService.getString("encabezados.editaUbicacion").subscribe(val => this.titulo = val);
      this.localizationService.getString("botones.guardar").subscribe(val => this.textBtn = val);
    }else if(this.ubicacion.idTarea){
      this.titulo = "EDITA UBICACIÓN";
      this.localizationService.getString("botones.guardar").subscribe(val => this.textBtn = val);
    }else{
      this.localizationService.getString("encabezados.nuevaUbicacion").subscribe(val => this.titulo = val);
      this.localizationService.getString("botones.guardar").subscribe(val => this.textBtn = val);
    }
  }
  onSubmit(form:NgForm){
    console.log(form);
    if(!form.valid || this.ubicacion.titulo == "-" || 
      this.ubicacion.longitud == 0 || this.ubicacion.latitud == 0){
      return;
    }
    /*if(this.ubicacion.idTarea == ""){
      this.ubicacion.fechasRecogida.forEach(val => {
        if(val.vehiculo == "-" || !val.fechaInicio|| !val.fechaFin || this.ubicacion.descripcion == "-" ){
          console.log("salta validacion vehiculo en parada");
          return;
        }
      });
    }*/
    
    this.resApi.resCargando('Espere...');


    if(this.ubicacion._id){
      this.ubiServ.patchParada(localStorage.getItem("token")!,this.ubicacion.fechasRecogida[0],this.ubicacion._id+"_"+this.idDestino).subscribe({next:res=>{
        switch(res.status) { 
          case 200: { 
            this.emiteCierraVentana();
            this.resApi.resMensajeSucBtn(res.message);
            break; 
          }
          case 202: {
            this.resApi.resMensajeWrnBtn(res.message);
            break; 
          } 
          case 405: {
            this.resApi.resMensajeErrBtn(res.message);
            break; 
          } 
          default: { 
            this.resApi.resMensajeErrBtn(res.message);
            break; 
          } 
        } 
      },error:err=>{
        this.resApi.resMensajeErrBtn(err);
      }});
    }else{
      
      if(this.ubicacion.idTarea == ""){
        console.log(this.ubicacion);
        this.ubiServ.postUbiParada(localStorage.getItem('token')!, this.ubicacion,this.idDestino).subscribe({ next:(res)=>{
          switch(res.status) { 
            case 201: { 
              this.emiteCierraVentana();
              this.resApi.resMensajeSucBtn('Ubicación de parada creado con éxito');
                break; 
            }
            case 400: {
              this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
                break; 
            } 
            default: { 
              this.resApi.resMensajeErrBtn(res.message);
                break; 
            } 
          } 
        },error:(err)=>{
          this.resApi.resMensajeErrBtn(err.error.message);
        }});
      }else{
        /*if(this.idDestino == "123"){
          console.log("llegamos");
        }else{*/
          this.ubicacion.fechasRecogida = [];
          this.ubiServ.postUbi(localStorage.getItem('token')!, this.ubicacion).subscribe({ next:(res)=>{
            console.log(res);
            switch(res.status) { 
              case 201: { 
                this.emiteCierraVentana();
                this.resApi.resMensajeSucBtn('Ubicación de tarea creada con éxito');
                  break; 
              }
              case 400: {
                this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
                  break; 
              } 
              default: { 
                this.resApi.resMensajeErrBtn(res.message);
                  break; 
              } 
            } 
          },error:(err)=>{
            this.resApi.resMensajeErrBtn(err.error.message);
          }});
        //}
      }

    }
  }
  emiteCierraVentana(){
    console.log(this.ubicacion);
    this.ubicacion = new UbicacionModel();
    this.eventoEmiteCierraFormUbi.emit(false);
  }
}
