import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
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

  constructor(private tarServ:TareaService,private auth:AuthService,private resPop:ApiResponseService,private router:Router) { }

  ngOnInit(): void {
    
    
    this.tarServ.getAllTareas(localStorage.getItem('token')!).subscribe(res=>{
      this.tareas = res;
      //console.log(this.solicitudes);
    },(err)=>{
      switch(err.error.status) { 
        case 401: { this.auth.logout();
          
          this.resPop.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
          this.auth.logout();
          
           break; 
        } 
        case 404: { 
          this.resPop.resMensajeErrBtn("No hay usuarios con ese nombre.");
           break; 
        } 
        case 0: { 
          this.resPop.resMensajeWrnBtn("Algo ha ido mal.");
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
