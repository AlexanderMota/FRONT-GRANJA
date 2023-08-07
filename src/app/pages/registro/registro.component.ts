import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiResponseService } from 'src/app/services/api-response.service';
import Swal from 'sweetalert2';
import { EmpleadoModel } from '../../models/empleado.model';
import { AuthService } from '../../services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  @Output() eventoEmiteCierraNuevaPersona = new EventEmitter<boolean>();
  empleado: EmpleadoModel = new EmpleadoModel();
  //recuerdame : boolean = false;
  @Input() roles:{nombre:string}[] = [];

  constructor(
    private auth:AuthService, 
    private resApi: ApiResponseService) { }

  ngOnInit() { } 
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    
    this.resApi.resCargando('Espere...');

    this.auth.registrarEmpleado(localStorage.getItem("token")!, this.empleado!).subscribe(res => {
      console.log(res);
      switch(res.status) { 
        case 201: { 
           Swal.close();
           this.emiteCierraVentana();
           /*if(this.recuerdame){
            localStorage.setItem('nombre', this.empleado!.nombre!);
            localStorage.setItem('password', this.empleado!.password!);
           }*/

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
      switch(err.error.status) { 
        case 400: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'El empleado ya está registrado.',
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
    });
  }
  emiteCierraVentana(){
    this.eventoEmiteCierraNuevaPersona.emit(false);
  }
}
