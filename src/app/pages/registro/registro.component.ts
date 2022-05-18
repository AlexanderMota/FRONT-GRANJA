import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmpleadoModel } from '../../models/empleado.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  empleado: EmpleadoModel | undefined;
  recuerdame : boolean = false;

  constructor(private auth:AuthService) { }

  ngOnInit() { 
    this.empleado = new EmpleadoModel();
  } 
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    
    Swal.fire({
      allowOutsideClick:false,
      text:'Espere...',
      icon:'info'
    });
    Swal.showLoading();

    this.auth.registrarEmpleado(this.empleado!).subscribe(res => {
      switch(res.status) { 
        case 201: { 
           Swal.close();

           if(this.recuerdame){
            localStorage.setItem('nombre', this.empleado!.nombre!);
            localStorage.setItem('password', this.empleado!.password!);
           }

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
            text:'El empleado ya está registrado.',
            icon:'error'
          });
           break; 
        }  
        case 401: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'La sesión ha caducado.',
            icon:'warning'
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
           //statements; 
           break; 
        } 
      } 
    });
  }

}
