import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
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

  constructor(private auth:AuthService, private tarServ:TareaService, private actRoute:ActivatedRoute) {
    this.actRoute.params.subscribe(params=>{
      console.log(params);
      if(params['id']){
        this.titulo = "Edita tarea";
        this.textBtn = "Guardar cambios"
        tarServ.getTareaById(localStorage.getItem('token')!,params['id']).subscribe(res=>{
          this.tarea=res;
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
    console.log(this.tarea);
    if(!form.valid){
      return;
    }
    Swal.fire({
      allowOutsideClick:false,
      text:'Espere...',
      icon:'info'
    });
    Swal.showLoading();

    this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea!).subscribe(res => {
      console.log(res.status);
      switch(res.status) { 
        case 201: { 
           Swal.close();
           break; 
        }
        case 0: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'Algo ha ido mal.',
            icon:'warning'
          });
           break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
      } 
    },(err)=>{
      switch(err.error.status) { 
        case 400: { 
          Swal.fire({
            allowOutsideClick:false,
            text:err.error.message,
            icon:'error'
          });
           break; 
        }  
        /*case 401: { 
          Swal.fire({
            allowOutsideClick:false,
            text:err.error.message,
            icon:'warning'
          });
           break; 
        } 
        case 402: { 
          Swal.fire({
            allowOutsideClick:false,
            text:err.error.message,
            icon:'warning'
          });
           break; 
        } 
        case 404: { 
          Swal.fire({
            allowOutsideClick:false,
            text:err.error.message,
            icon:'warning'
          });
           break; 
        } */
        case 0: { 
          Swal.fire({
            allowOutsideClick:false,
            text:err.error.message,
            icon:'warning'
          });
           break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
      } 
    });
  }
}
