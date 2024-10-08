import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import jwtDecode from 'jwt-decode';

import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiResponseService } from 'src/app/services/api-response.service';
//import { NavbarComponent } from 'src/app/components/navbar/navbar.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

  usuario : UsuarioModel = new UsuarioModel();
  recuerdame : boolean = false;

  constructor(private auth: AuthService,
          private router: Router,
          private resPop:ApiResponseService) { }

  ngOnInit(): void {
    this.resPop.resCargando('Espere...');
    
    if(localStorage.getItem('token')){
      this.auth.compruebaTokenValido().subscribe(res=>{
        if(res.status == 201){
          this.router.navigateByUrl('/home');
        }
      });
    };
    if(localStorage.getItem('nombre') && localStorage.getItem('password')){
      this.usuario.email = localStorage.getItem('nombre')!;
      this.usuario.password = localStorage.getItem('password')!;
      this.recuerdame = true;
     }
     Swal.close();
  }
  login(form: NgForm){
    if(!form.valid){
      return;
    }

    this.resPop.resCargando('Espere...');

    this.auth.login(this.usuario).subscribe(res => {
      switch(res.status) {
        case 201: {
          /*console.log(res.message);
          let aver = {empleado:{nombre:""}};
          aver = jwtDecode(res.message);
          console.log(localStorage.getItem("rol"));*/
          
          this.auth.guardaToken(res.message);
           Swal.close();

           if(this.recuerdame){
            localStorage.setItem('nombre', this.usuario.email!);
            localStorage.setItem('password', this.usuario.password!);
           }else{
            localStorage.removeItem('nombre');
            localStorage.removeItem('password');
           }
            this.router.navigateByUrl('/');
           break;
        }
        case 0: {
          this.resPop.resMensajeWrnBtn('Algo ha ido mal.');
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
          this.resPop.resMensajeErrBtn('Uno de los parametros es erroneo.');
           break;
        }
        case 404: { 
          this.resPop.resMensajeErrBtn('No hay usuarios con ese nombre.');
           break; 
        } 
        case 0: {
          this.resPop.resMensajeWrnBtn('Algo ha ido mal.');
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
