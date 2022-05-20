import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudModel } from 'src/app/models/solicitud.model';
import { AuthService } from 'src/app/services/auth.service';
import { SolicitudService } from 'src/app/services/solicitud.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  titulo="Solicitudes";
  posttitulo="Lista de empleados interesados en tareas.";
  solicitudes:SolicitudModel[] = [];

  constructor(private solServ:SolicitudService,
          private router:Router,
          private auth:AuthService) { }

  ngOnInit(): void {
    //console.log(this.auth.token);

    this.solServ.getAllSolicitudes(localStorage.getItem('token')!).subscribe(res=>{
      this.solicitudes = res;
      //console.log(this.solicitudes);
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
        case 401: { 
          Swal.fire({
            allowOutsideClick:false,
            text:'La sesión ha expirado. Vuelva a iniciar sesion',
            icon:'warning'
          }).then((result) => {
            this.auth.logout();
            if (result.isConfirmed) {
              this.router.navigateByUrl('/');
            }
          });
          
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
