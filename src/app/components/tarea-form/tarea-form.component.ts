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
  @Output() 
  eventoEmiteIdTareaUbi = new EventEmitter<string>();

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
    
    this.locServ.getArray("colecciones.rangoImportancia").subscribe(val=>this.imps = val);
    this.empServ.getDepartamentos(localStorage.getItem('token')!).subscribe(res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
      }else{
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
    });
    this.actRoute.params.subscribe(params=>{

      if(params['id']){
        this.paramId = params['id'];
        if(this.editaTar){
          this.locServ.getString("encabezados.editarTarea").subscribe(val=>this.titulo = val);
          this.locServ.getString("botones.guardarCambios").subscribe(val=>this.textBtn = val);
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
            }
          });
          this.tarServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
            if((res as ApiResponse)){
              console.log((res as ApiResponse).message);
            }else{
              this.supers[0] = res as TareaModel;
            }
          });
        }else{
          this.locServ.getString("encabezados.guardaSubTarea").subscribe(val=>this.titulo = val);
          this.locServ.getString("botones.guardaTarea").subscribe(val=>this.textBtn = val);
          this.idSuper = this.paramId;
          this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
            if((res as ApiResponse).status){
              console.log((res as ApiResponse).message);
            }else{
              this.supers[0] =res as TareaModel;
            }
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
        });
        this.editaTar = false;
      }
    });
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
      if(this.paramId){
        this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea ,this.paramId).subscribe({next:(res) => {
          switch(res.status) { 
            case 201: { 
                const ids = res.message.split("_");
                console.log(ids);
              this.locServ.getString("mensajesInformacion.201PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(ids[0] + val));
              this.locServ.getString("mensajesInformacion.infoUbiNuevaTarea").subscribe(val=> this.resApi.resMensajeWrnBtnThen("resMensajeWrnBtnThen: "+val)
              .then(val=>{
                if(val.isConfirmed) {
                  this.eventoEmiteIdTareaUbi.emit(ids[1]);
                  this.eventoEmiteCierraFormTarea.emit(false);
                }else if(!val.isConfirmed) {
                  console.log("La tarea tiene la misma ubi que su padre.");
                  location.reload();
                  this.eventoEmiteCierraFormTarea.emit(false);
                }
              })
              .catch(err=>console.log(err)));
              break; 
            }
            case 400: { 
              this.locServ.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
              this.eventoEmiteCierraFormTarea.emit(false);
               break; 
            } 
            default: { 
              this.locServ.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
              this.eventoEmiteCierraFormTarea.emit(false);
               break; 
            } 
          } 
        },error:(err)=>{
          this.resApi.resMensajeErrBtn(err.error.message);
        }});
      }else{
        console.log(localStorage.getItem('centroActual')!);
        this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea ,localStorage.getItem('centroActual')!).subscribe({next:(res) => {
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
    
  }
  
  emiteCierraVentana(){ this.eventoEmiteCierraFormTarea.emit(false); }
  agregaRol() { this.tarea.plantilla.push({ rol: '', cantidad: 0 }); /*Agrega un nuevo objeto a la plantilla*/ }
  quitaRol(pos:number){ this.tarea.plantilla.splice(pos,1); }
}
