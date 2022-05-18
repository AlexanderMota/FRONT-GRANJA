import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
//import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  usuario : UsuarioModel = new UsuarioModel();

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    
  }
  login(form: NgForm){
    if(!form.valid){
      return;
    }

    Swal.fire({
      allowOutsideClick:false,
      text:'Espere...',
      icon:'info'
    });
    Swal.showLoading();
    
    this.auth.login(this.usuario).subscribe(res => {
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
            text:'Uno de los parametros es erroneo.',
            icon:'error'
          });
          console.log("cerrando swal");
           break; 
        }  
        case 404: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'No hay usuarios con ese nombre.',
            icon:'error'
          });
          console.log("cerrando swal");
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
