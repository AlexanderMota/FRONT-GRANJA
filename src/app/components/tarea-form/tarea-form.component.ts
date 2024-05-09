import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.css']
})

export class TareaFormComponent implements OnInit {

  @Output() 
  eventoEmiteCierraFormTarea = new EventEmitter<boolean>();

  @Input() 
  editaTar : boolean = false;
  
  imps : string[] = [];
  supers : TareaModel[] = [];
  departamentos : { nombre: string }[] = [];
  tarea: TareaModel = new TareaModel();
  titulo:string = "";
  textBtn:string = "";
  fechaIni:string = "";
  fechaFin:string = "";
  roles : string[] = [];

  private paramId : string = "";
  private idSuper : string = "";

  constructor(
    private resApi:ApiResponseService, 
    private tarServ:TareaService, 
    private empServ:EmpleadoService,
    private actRoute:ActivatedRoute,
    private locServ:LocalizationService) { }

  ngOnInit(): void {
    this.empServ.getDepartamentos(localStorage.getItem('token')!).subscribe(res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
      }else{
        //console.log(res);
        this.departamentos = res as {
          nombre: string;
        }[];
      }
    });
    
    this.empServ.getRoles(localStorage.getItem('token')!).subscribe(res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
      }else{
        this.roles = res as string[];
      }
      //console.log(res); 
    });
    this.actRoute.params.subscribe(params=>{
    //console.log(params['id']);

      if(params['id']){
        this.paramId = params['id'];
        this.locServ.getArray("colecciones.rangoImportancia").subscribe(val=>this.imps = val);
        if(this.editaTar){
          this.locServ.getString("encabezados.editarTarea").subscribe(val=>this.titulo = val);
          this.locServ.getString("botones.guardarCambios").subscribe(val=>this.textBtn = val);
          //console.log("contructor route paramid=>\n"+this.paramId);
          this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
            if((res as ApiResponse).status){
              console.log((res as ApiResponse).message);
            }else{
              this.tarea=res as TareaModel;
              let fech = this.tarea.fechainicio.toString();
              this.tarea.fechainicio = new Date(fech.slice(0,19));
              this.fechaIni = fech.slice(0,19);
              if(this.tarea.fechafin){
                fech = this.tarea.fechafin.toString();
                this.tarea.fechafin = new Date(fech.slice(0,19));
                this.fechaFin = fech.slice(0,19);
              }
              if(this.tarea.plantilla.length < 1){
                this.tarea.plantilla[0] = {rol:"",cantidad:0};
              }
              //console.log(this.tarea.departamento);
            }
            //console.log("contructor route params=>\n"+res);
          });
          this.tarServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
            if((res as ApiResponse)){
              console.log((res as ApiResponse).message);
            }else{
              this.supers[0] = res as TareaModel;
            }
            //console.log("contructor route params=>\n"+res);
          });
        }else{
          /*const elemento = document.getElementById('organizacion');
          if(elemento){
            elemento.style.display = 'none';
          }*/
          this.locServ.getString("encabezados.guardaSubTarea").subscribe(val=>this.titulo = val);
          this.locServ.getString("botones.guardaTarea").subscribe(val=>this.textBtn = val);
          this.idSuper = this.paramId;
          //console.log("contructor route paramid=>\n"+this.paramId);
          this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
            if((res as ApiResponse).status){
              console.log((res as ApiResponse).message);
            }else{
              this.supers[0] =res as TareaModel;
            }
            //console.log("contructor route params=>\n"+res);
          });
        }
      }else{
        this.locServ.getString("encabezados.guardaTarea").subscribe(val=>this.titulo = val);
        this.locServ.getString("botones.guardaTarea").subscribe(val=>this.textBtn = val);
        this.tarServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
          if(res as ApiResponse){
            console.log((res as ApiResponse).message);
          }else{
          this.supers[0] = res as TareaModel;
          }
          //console.log("contructor route params=>\n"+res);
        });
        this.editaTar = false;
      }
      
    });
    /*this.compMess.emiteDato.subscribe(dato => {console.log(dato.dato);
  
    this.oculto=!dato.dato;})*/
  }
  onSubmit(form:NgForm){
    if(!form.valid || this.tarea.importancia == "-" || 
      this.tarea.nombre == "" || this.tarea.departamento== "-" || 
      this.tarea.plantilla.length < 1){
      return;
    }
    this.tarea.plantilla.forEach(val => {
      if(val.cantidad < 1 || val.rol.length < 1){
        console.log("salta val//////////////////////////////");
        return;
      }
    });
    this.resApi.resCargando('Espere...');
    if(this.editaTar){
      this.tarea.fechainicio = new Date(this.fechaIni);
      this.tarea.fechafin = new Date(this.fechaFin);
      this.tarServ.patchTarea(localStorage.getItem('token')!, this.tarea!).subscribe({next:(res) => {
        switch(res.status) { 
          case 201: { 
            this.locServ.getString("mensajesInformacion.201PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
             break; 
          }
          case 202: { 
            this.locServ.getString("mensajesInformacion.202PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
             break; 
          }
          case 400: { 
            this.locServ.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
             break; 
          } 
          default: { 
             break; 
          } 
        }
      },error:(err)=>{
        this.resApi.resMensajeErrBtn(err.error.message);
      }});
      
    }else{
/*
      console.log("tarea nueva: ");
      console.log(this.tarea);
      console.log("idSuper: ");
      console.log(this.idSuper);
*/
      if(this.paramId){
        this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea ,this.paramId).subscribe({next:(res) => {
          switch(res.status) { 
            case 201: { 
              this.locServ.getString("mensajesInformacion.201PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
              this.locServ.getString("mensajesInformacion.infoUbiNuevaTarea").subscribe(val=> this.resApi.resMensajeWrnBtnRedir(val,"/tareas/"));
               break; 
            }
            case 400: { 
              this.locServ.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
               break; 
            } 
            default: { 
              this.locServ.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
               break; 
            } 
          } 
        },error:(err)=>{
          this.resApi.resMensajeErrBtn(err.error.message);
        }});
      }else{
        this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea ,this.idSuper).subscribe({next:(res) => {
          switch(res.status) { 
            case 201: { 
              this.locServ.getString("mensajesInformacion.201PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
              this.locServ.getString("mensajesInformacion.infoUbiNuevaTarea").subscribe(val=> this.resApi.resMensajeWrnBtnRedir(val,"/tareas/"));
               break; 
            }
            case 400: { 
              this.locServ.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
               break; 
            } 
            default: { 
              this.locServ.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
               break; 
            } 
          } 
        },error:(err)=>{
          this.resApi.resMensajeErrBtn(err.error.message);
        }});
      }
    }
    
    this.eventoEmiteCierraFormTarea.emit(false);
  }
  
  emiteCierraVentana(){
    this.eventoEmiteCierraFormTarea.emit(false);
  }
  agregaRol() {
    this.tarea.plantilla.push({ rol: '', cantidad: 0 }); // Agrega un nuevo objeto a la plantilla
  }
  quitaRol(pos:number){
    console.log(this.tarea);
    this.tarea.plantilla.splice(pos,1);
    console.log(this.tarea);
  }
}
