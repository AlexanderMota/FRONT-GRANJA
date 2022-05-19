import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { NavbarComponent } from 'src/app/components/navbar/navbar.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

  usuario : UsuarioModel = new UsuarioModel();
  recuerdame : boolean = false;

  constructor(private auth: AuthService,
          private router: Router) { }

  ngOnInit(): void {
    Swal.fire({
      allowOutsideClick:false,
      text:'Espere...',
      icon:'info'
    });
    Swal.showLoading();
    if(localStorage.getItem('token')){
      this.auth.conpruebaTokenValido().subscribe(res=>{
        if(res.status == 201){
          this.router.navigateByUrl('/home');
        }
      });
    };
    if(localStorage.getItem('nombre') && localStorage.getItem('password')){
      this.usuario.nombre = localStorage.getItem('nombre')!;
      this.usuario.password = localStorage.getItem('password')!;
      this.recuerdame = true;
     }
     Swal.close();
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
          this.auth.guardaToken(res.message!);
           Swal.close();

           if(this.recuerdame){
            localStorage.setItem('nombre', this.usuario.nombre!);
            localStorage.setItem('password', this.usuario.password!);
           }
            this.router.navigateByUrl('/');
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
