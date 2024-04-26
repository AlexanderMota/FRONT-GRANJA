import { Component, Input, OnInit, Renderer2, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { ComponentMessageService } from 'src/app/services/component-message.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { TareaService } from 'src/app/services/tarea.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.component.html',
  styleUrls: ['./tarea-form.component.css']
})

export class TareaFormComponent implements OnInit {

  @Output() 
  eventoEmiteCierraFormTarea = new EventEmitter<boolean>();

  @Input() 
  imps : string[] = [];
  @Input() 
  departamentos : { nombre: string }[] = [];
  @Input() 
  flag : boolean = true;
  
  //depart : { nombre: string } = {nombre : ""};
  supers : TareaModel[] = [];
  tarea: TareaModel = new TareaModel();
  idSuper : string = "";
  titulo:string = "";
  textBtn:string = "";
  private paramId : string = "";

  constructor(
    private resApi:ApiResponseService, 
    private tarServ:TareaService, 
    private actRoute:ActivatedRoute,
    private localizationService:LocalizationService) {
    
   }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params=>{
    //console.log(params['id']);
      if(params['id']){
        this.paramId = params['id'];
        if(this.flag){
          this.localizationService.getString("encabezados.editarTarea").subscribe(val=>this.titulo = val);
          this.localizationService.getString("botones.guardarCambios").subscribe(val=>this.textBtn = val);
          //console.log("contructor route paramid=>\n"+this.paramId);
          this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
            this.tarea=res;
            //console.log("contructor route params=>\n"+res);
          });
          this.tarServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
            this.supers[0] = res;
            //console.log("contructor route params=>\n"+res);
          });
        }else{
          /*const elemento = document.getElementById('organizacion');
          if(elemento){
            elemento.style.display = 'none';
          }*/
          document.getElementById('organizacion')!.style.display = 'none';
          this.localizationService.getString("encabezados.guardaSubTarea").subscribe(val=>this.titulo = val);
          this.localizationService.getString("botones.guardaTarea").subscribe(val=>this.textBtn = val);
          this.idSuper = this.paramId;
          //console.log("contructor route paramid=>\n"+this.paramId);
          this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
            this.supers[0] =res;
            //console.log("contructor route params=>\n"+res);
          });
        }
      }else{
        this.localizationService.getString("encabezados.guardaTarea").subscribe(val=>this.titulo = val);
        this.localizationService.getString("botones.guardaTarea").subscribe(val=>this.textBtn = val);
        this.tarServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
          this.supers[0] = res;
          //console.log("contructor route params=>\n"+res);
        });
        this.flag = false;
      }
      
    });
    /*this.compMess.emiteDato.subscribe(dato => {console.log(dato.dato);
  
    this.oculto=!dato.dato;})*/
  }
  onSubmit(form:NgForm){
    if(!form.valid || this.tarea.importancia == "-" || this.tarea.nombre == "" || this.tarea.departamento== "-"){
      return;
    }
    this.resApi.resCargando('Espere...');
    if(this.flag){
      this.tarServ.patchTarea(localStorage.getItem('token')!, this.tarea!).subscribe({next:(res) => {
        switch(res.status) { 
          case 201: { 
            this.localizationService.getString("mensajesInformacion.201PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
             break; 
          }
          case 202: { 
            this.localizationService.getString("mensajesInformacion.202PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
             break; 
          }
          case 400: { 
            this.localizationService.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
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
              this.localizationService.getString("mensajesInformacion.201PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
              this.localizationService.getString("mensajesInformacion.infoUbiNuevaTarea").subscribe(val=> this.resApi.resMensajeWrnBtnRedir(val,"/tarea/"+res.id));
               break; 
            }
            case 400: { 
              this.localizationService.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
               break; 
            } 
            default: { 
              this.localizationService.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
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
              this.localizationService.getString("mensajesInformacion.201PatchTarea").subscribe(val=>this.resApi.resMensajeSucBtn(val));
              this.localizationService.getString("mensajesInformacion.infoUbiNuevaTarea").subscribe(val=> this.resApi.resMensajeWrnBtnRedir(val,"/tarea/"+res.id));
               break; 
            }
            case 400: { 
              this.localizationService.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
               break; 
            } 
            default: { 
              this.localizationService.getString("mensajesError.desconocido").subscribe(val=>this.resApi.resMensajeWrnBtn(val));
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
}

