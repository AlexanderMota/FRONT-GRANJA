import { Component, Input, OnInit, Renderer2, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { ComponentMessageService } from 'src/app/services/component-message.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
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
    private actRoute:ActivatedRoute) {
    
   }

  ngOnInit(): void {
    this.actRoute.params.subscribe(params=>{
    //console.log(params['id']);
      if(params['id']){
        this.paramId = params['id'];
        if(this.flag){
          this.titulo = "Edita tarea";
          this.textBtn = "Guardar cambios"
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
          this.titulo = "Crea subtarea";
          this.textBtn = "Guardar tarea"
          this.idSuper = this.paramId;
          //console.log("contructor route paramid=>\n"+this.paramId);
          this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
            this.supers[0] =res;
            //console.log("contructor route params=>\n"+res);
          });
        }
      }else{
        this.titulo = "Nueva tarea";
        this.textBtn = "Crear tarea"
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
      this.tarServ.patchTarea(localStorage.getItem('token')!, this.tarea!).subscribe(res => {
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
      
    }else{
/*
      console.log("tarea nueva: ");
      console.log(this.tarea);
      console.log("idSuper: ");
      console.log(this.idSuper);
*/
      if(this.paramId){
        this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea ,this.paramId).subscribe(res => {
          switch(res.status) { 
            case 201: { 
              this.resApi.resMensajeSucBtn('Tarea creada con éxito');
              this.resApi.resMensajeWrnBtnRedir('¿Desea especificar una ubicación para esta tarea?',"/tarea/"+res.id);
               break; 
            }
            case 400: { 
              this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
               break; 
            } 
            default: { 
              this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
               break; 
            } 
          } 
        },(err)=>{
          this.resApi.resMensajeErrBtn(err.error.message);
        });
      }else{
        this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea ,this.idSuper).subscribe(res => {
          switch(res.status) { 
            case 201: { 
              this.resApi.resMensajeSucBtn('Tarea creada con éxito');
              this.resApi.resMensajeWrnBtnRedir('¿Desea especificar una ubicación para esta tarea?',"/tarea/"+res.id);
               break; 
            }
            case 400: { 
              this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
               break; 
            } 
            default: { 
              this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
               break; 
            } 
          } 
        },(err)=>{
          this.resApi.resMensajeErrBtn(err.error.message);
        });
      }
    }
    
    this.eventoEmiteCierraFormTarea.emit(false);
  }
  
  emiteCierraVentana(){
    this.eventoEmiteCierraFormTarea.emit(false);
  }
}

