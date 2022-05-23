import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { AuthService } from 'src/app/services/auth.service';
import { TareaService } from 'src/app/services/tarea.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  titulo="Tareas";
  posttitulo="Lista de todas las tareas disponibles";
  tareas:TareaModel[] = [];

  constructor(private tarServ:TareaService,private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    
    
    this.tarServ.getAllTareas(localStorage.getItem('token')!).subscribe(res=>{
      this.tareas = res;
      //console.log(this.solicitudes);
    },(err)=>{
      switch(err.error.status) { 
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
