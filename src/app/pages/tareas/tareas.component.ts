import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  subtareas:TareaModel[] = [];
  imps:string[] = [];
  departamentos:{nombre:string}[] = [];
  supers:TareaModel[] = [];
  paramIdSuper = "";

  constructor(
    private tarServ:TareaService,
    private empServ:EmpleadoService,
    private auth:AuthService,
    private resPop:ApiResponseService,
    private actRoute:ActivatedRoute) {
     }

  ngOnInit(): void {
      if(localStorage.getItem('centroActual')){
        this.tarServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
          this.titulo += " del centro " + res.nombre;
        });
        this.tarServ.getSubtareas(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
          this.subtareas = res.sort();
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
              this.resPop.resMensajeErrBtn("No hay tareas en este centro.");
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
        
      }else{
        
      };
    /*await this.tarServ.getSubtareas(localStorage.getItem('token')!,this.idTarea)
        .subscribe(async res=>{
          this.subtareas=res;
          //console.log("comentarios paramID: " + this.subtareas[0].descripcion);
        });*/
    
    /*this.tarServ.getAllTareas(localStorage.getItem('token')!).subscribe(res=>{
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
    });*/
    
    // al ser solo para el formulario, conviene recortar la info solicitada en esta petición
    
    
  } 
  abreVentana(): void{
    this.empServ.getDepartamentos(localStorage.getItem('token')!).subscribe(res=>{
      this.departamentos = res;
      this.imps = ["Crítica","Alta","Media","Baja"];
      //console.log(res);
    });
    this.showP = true;
  }
  receiveMessage($event: boolean){
    this.showP = $event;
  }
}
