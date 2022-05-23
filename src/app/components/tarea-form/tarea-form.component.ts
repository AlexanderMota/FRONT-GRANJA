import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { TareaService } from 'src/app/services/tarea.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarea-form',
  templateUrl: './tarea-form.component.html'
})
export class TareaFormComponent implements OnInit {

  tarea: TareaModel = new TareaModel();
  titulo:string = "";
  textBtn:string = "";
  private paramId : string = "";

  constructor(private resApi:ApiResponseService, private tarServ:TareaService, private actRoute:ActivatedRoute) {
    this.actRoute.params.subscribe(params=>{
      //console.log(params);
      if(params['id']){
        this.titulo = "Edita tarea";
        this.textBtn = "Guardar cambios"
        this.paramId = params['id'];
        //console.log("contructor route paramid=>\n"+this.paramId);
        tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
          this.tarea=res;
          //console.log("contructor route params=>\n"+res);
        });
      }else{
        this.titulo = "Nueva tarea";
        this.textBtn = "Crear tarea"
      }
    });
   }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm){
    if(!form.valid || this.tarea.importancia.length < 1){
      return;
    }
    this.resApi.resCargando('Espere...');
    if(this.paramId.length > 0){
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
             //statements; 
             break; 
          } 
        } 
      },(err)=>{
        this.resApi.resMensajeErrBtn(err.error.message);
      });
    }else{
      this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea!).subscribe(res => {
        switch(res.status) { 
          case 201: { 
            this.resApi.resMensajeSucBtn('Tarea creada con éxito');
             break; 
          }
          case 0: { 
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
    }
  }
}

