import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiResponseService } from 'src/app/services/api-response.service';
import Swal from 'sweetalert2';
import { EmpleadoModel } from '../../models/empleado.model';
import { AuthService } from '../../services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { TareaService } from 'src/app/services/tarea.service';
import { TareaModel } from 'src/app/models/tarea.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  @Input() idPerfil = "";
  @Output() eventoEmiteCierraNuevaPersona = new EventEmitter<boolean>();
  empleado: EmpleadoModel = new EmpleadoModel();
  //recuerdame : boolean = false;
  roles:string[] = [];
  supers:TareaModel[] = [];
  editarPerfil = "";

  constructor(
    private auth:AuthService, 
    private empServ:EmpleadoService,
    private tarServ:TareaService,
    private resApi: ApiResponseService) { }

  ngOnInit() { 
    this.tarServ.getSuperTareas(localStorage.getItem('token')!).subscribe({next:res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
      }else{
        this.supers = res as TareaModel[];
      }
      
    },error:err=>console.log(err)});
    this.empServ.getRoles(localStorage.getItem('token')!).subscribe({next:res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
      }else{
        this.roles = res as string[];
      }
      //console.log(res); 
    },error:err=>console.log(err)});
  } 
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    
    this.resApi.resCargando('Espere...');

    console.log("onSubmit() ============> llegamos");
    this.auth.registrarEmpleado(localStorage.getItem("token")!, this.empleado!).subscribe({next:res => {
      console.log(res);
      switch(res.status) { 
        case 201: { 
          this.resApi.resMensajeSucBtn(res.message);
           this.emiteCierraVentana();
           break; 
        }
        default: { 
          this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
           break; 
        } 
      } 
    },error:err=>{
      switch(err.error.status) { 
        case 400: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'El empleado ya está registrado.',
            icon:'error'
          });
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
        case 0: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'Algo ha ido mal.',
            icon:'warning'
          });
           break; 
        } 
        default: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'Algo ha ido mal.',
            icon:'error'
          });
           break; 
        } 
      } 
    }});
  }
  emiteCierraVentana(){
    this.eventoEmiteCierraNuevaPersona.emit(false);
  }
}
