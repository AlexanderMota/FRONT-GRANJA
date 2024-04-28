import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { LocalizationService } from 'src/app/services/localization.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

  comentarios : ComentarioModel[] = [];
  comentario : ComentarioModel = new ComentarioModel();
  idTarea : string = "";
  constructor(
    private resApi: ApiResponseService,
    private actRoute:ActivatedRoute,
    private commServ:ComentarioService,
    private localizationService: LocalizationService) { 
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        this.idTarea = params['id'];
        await this.commServ.getAllComentariosByIdTarea(localStorage.getItem('token')!,this.idTarea)
        .subscribe(async res=>{
          if ((res as ApiResponse).status){
            console.log((res as ApiResponse).message);
          }else{
            this.comentarios=res as ComentarioModel[];
          }
          //console.log("comentarios paramID: " + this.comentarios[0].descripcion);
        });
      }else{
        
      }
    });
  }

  ngOnInit(): void {
  }
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    
    this.resApi.resCargando('Espere...');

    this.comentario.idTarea = this.idTarea;
    this.comentario.idAutor = localStorage.getItem("miid")!;
    console.log(this.comentario);
    this.commServ.postComentarioByIdTarea(localStorage.getItem("token")!, this.comentario!).subscribe({next:(res) => {
      switch(res.status) { 
        case 201: { 
          
           Swal.close();
/*
           if(this.recuerdame){
            localStorage.setItem('nombre', this.empleado!.nombre!);
            localStorage.setItem('password', this.empleado!.password!);
           }
*/
           break; 
        }
        case 0: { 
          
          this.localizationService.getString("mensajesError.desconocido").subscribe(val => 
          this.resApi.resMensajeWrnBtn(val));
           break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
      } 
    },error:(err)=>{
      switch(err.error.status) { 
        case 400: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'Error al cargar el comentario.',
            icon:'error'
          });
           break; 
        }  
        case 401: { 
          /*this.resApi.resMensajeWrnBtn('La sesión ha caducado.');
          Swal.fire({
            allowOutsideClick:false,
            text:'La sesión ha caducado.',
            icon:'warning'
          });*/
           break; 
        } 
        case 402: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'No tiene autorización.',
            icon:'warning'
          });
           break; 
        } 
        case 404: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'Algo ha ido mal...',
            icon:'warning'
          });
           break; 
        } 
        case 500: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'Error interno del servidor.',
            icon:'error'
          });
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
    }});
  }
}
