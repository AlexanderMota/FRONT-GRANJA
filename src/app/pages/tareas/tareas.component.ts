import { Component, OnInit, ViewChild } from '@angular/core';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TareaService } from 'src/app/services/tarea.service';
//import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  showP : boolean= false;
  titulo="Tareas";
  posttitulo="Lista de todas las tareas disponibles";
  tareas:TareaModel[] = [];
  imps:string[] = [];
  supers:TareaModel[] = [];
  departamentos:{nombre:string}[] = [];

  constructor(
    private tarServ:TareaService,
    private empServ:EmpleadoService,
    private auth:AuthService,
    private resPop:ApiResponseService) {
     }

  ngOnInit(): void {
    
    
    this.tarServ.getAllTareas(localStorage.getItem('token')!).subscribe(res=>{
      this.tareas = res.sort();
      //console.log(this.solicitudes);
    },(err)=>{
      switch(err.error.status) { 
        case 401: { 
          this.auth.logout();
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
    
    // al ser solo para el formulario, conviene recortar la info solicitada en esta petición
    
    
  } 
  abreVentana(): void{
    this.empServ.getDepartamentos(localStorage.getItem('token')!).subscribe(res=>{
      this.departamentos = res;
      //console.log(res);
    });
    this.tarServ.getSuperTareas(localStorage.getItem('token')!).subscribe(res=>{
      this.supers=res;
      this.imps = ["Crítica","Alta","Media","Baja"]
    });
    this.showP = true;
  }
  receiveMessage($event: boolean){
    this.showP = $event;
  }
}
