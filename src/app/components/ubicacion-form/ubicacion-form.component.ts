import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  @Output() 
  eventoEmiteCierraFormUbi = new EventEmitter<boolean>();

  //showP2:boolean = false;
  titulo:string = "";
  textBtn:string = "";
  coches: {matricula:string,plazas:number}[]=[];
  fechaRecogida: {fechaInicio:Date,fechaFin:Date,vehiculo:string}[]=[{fechaInicio:new Date,fechaFin:new Date,vehiculo:""}];
  //private paramId : string = "";

  constructor( 
    private resApi:ApiResponseService, 
    private ubiServ:UbicacionService,
    private vehiServ:VehiculoService,
    private localizationService: LocalizationService) {
      this.vehiServ.getVehiculosByPropietario(
        localStorage.getItem("token")!,
        localStorage.getItem("miid")!).subscribe(res => {
        
          if((res as ApiResponse).status){
            console.log((res as ApiResponse).message);
          }else{
            (res as [VehiculoModel]).forEach(dat =>{
              //if((dat.plazas-(dat.ocupantes.length + 1)) > 0){
              this.coches[this.coches.length] = {matricula:dat.matricula,plazas:dat.plazas-(dat.ocupantes.length + 1)};
              //}
            });
          }
          //console.log(res);
      });
    /*this.actRoute.params.subscribe(params=>{
      
      //console.log(params['id']);
      if(params['id']){
        this.titulo = "Edita vehículo";
        this.textBtn = "Guardar cambios"
        this.paramId = params['id'];
        //console.log("contructor route paramid=>\n"+this.paramId);
        vehiServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
          this.vehiculo=res;
          //console.log("contructor route params=>\n"+res);
        });
      }else{
        this.titulo = "Nueva ubicación";
        this.textBtn = "Registrar ubicación"
        vehiServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
          this.supers.push(res);
          //console.log("contructor route params=>\n"+res);
        });
      //}
      
    }); */
  }

  ngOnInit(): void {
    //console.log("idubi: "+this.ubicacion._id);
    if(this.ubicacion._id){
      this.localizationService.getString("encabezados.editaUbicacion").subscribe(val => this.titulo = val);
      this.localizationService.getString("botones.guardar").subscribe(val => this.textBtn = val);
    }else{
      this.localizationService.getString("encabezados.nuevaUbicacion").subscribe(val => this.titulo = val);
      this.localizationService.getString("botones.guardar").subscribe(val => this.textBtn = val);
    }
  }
  onSubmit(form:NgForm){
    if(!form.valid || this.ubicacion.titulo == "-" || this.ubicacion.descripcion == "-" || 
      this.ubicacion.longitud == 0 || this.ubicacion.latitud == 0){
      return;
    }
    this.ubicacion.fechasRecogida.forEach(val => {
      if(val.vehiculo.length < 1 || !val.fechaInicio || !val.fechaFin){
        console.log("salta validacion vehiculo en parada");
        return;
      }
    });
    this.resApi.resCargando('Espere...');

    this.ubicacion.fechasRecogida.push(this.fechaRecogida[0]);

    if(this.ubicacion._id){
      console.log("entrando al patchUbi");
      this.ubiServ.patchParada(localStorage.getItem("token")!,this.ubicacion.fechasRecogida[0],this.ubicacion._id).subscribe({next:res=>{
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
              //statements; 
              break; 
          } 
        } 
      },error:err=>{
        this.resApi.resMensajeErrBtn(err);
      }});
    }else{
      this.ubiServ.postUbiParada(localStorage.getItem('token')!, this.ubicacion).subscribe({ next:(res)=>{
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
              //statements; 
              break; 
          } 
        } 
      },error:(err)=>{
        this.resApi.resMensajeErrBtn(err.error.message);
      }});
    }
  }
  emiteCierraVentana(){
    this.ubicacion = new UbicacionModel();
    this.eventoEmiteCierraFormUbi.emit(false);
  }
}
