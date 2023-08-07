import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { ComponentMessageService } from 'src/app/services/component-message.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TareaService } from 'src/app/services/tarea.service';
import { Location } from '@angular/common';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { UbicacionModel } from 'src/app/models/ubicacion.model';

@Component({
  selector: 'app-tarea-details',
  templateUrl: './tarea-details.component.html',
  styleUrls: ['./tarea-details.component.css']
})
export class TareaDetailsComponent implements OnInit {
  
  tarea: TareaModel = new TareaModel();
  comentarios: ComentarioModel[] = [];
  empleados: EmpleadoModel[] = [];
  empleadosDisp: EmpleadoModel[] = [];
  //empleadoNuevo: EmpleadoModel = {_id: 'Empleados', idEmpleado : 0, nombre : "", apellidos:"",telefono:"", email:"", password:""};
  showP : boolean= false;
  showPEmpD : boolean= false;

  //@Input() oculto:boolean = false;
  private paramId : string = "";

  constructor(
    private ubiServ:UbicacionService,
    private tarServ:TareaService,
    private empServ: EmpleadoService,
    private compMess:ComponentMessageService,
    private actRoute:ActivatedRoute,
    private resPop:ApiResponseService,
    private auth:AuthService) {
    
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        this.paramId = params['id'];
        await this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId)
        .subscribe(res1=>{
          this.tarea=res1;
        });
        await this.empServ.getEmpleadosByTarea(localStorage.getItem('token')!,this.paramId)
        .subscribe(res2=>{
          this.empleados=res2;
          //this.empleados.push({_id: 'Empleados', idEmpleado : 0, nombre : "Añadir empleado", apellidos:"",telefono:"", email:"", password:""});
        });
      }else{
        
      }
    });
    //console.log("---idTarea: " + this.tarea.nombre + "\n---ubi: " + this.ubi._id );
  }
  /*oculta(){
    this.oculto = !this.oculto;
    this.compMess.emiteDato.emit({dato:this.oculto});
  }*/

  ngOnInit(): void { }

  async borraTarea(){
    this.resPop.resCargando('Espere...');
    await this.tarServ.deleteTarea(localStorage.getItem('token')!,this.tarea._id).subscribe(res=>{
      const flag = res;
      if(flag){
        this.resPop.resMensajeSucBtnRedir("Tarea eliminada correctamente.","tareas")
      }else{
        this.resPop.resMensajeErrBtn("La tarea no se eliminó correctamente.")
      }
    })
  }

  abreVentana(){
    this.showP = true;
  }
  receiveMessage($event: boolean){
    this.showP = $event;
  }
  emiteCierraVentana(){
    this.showPEmpD = false;
  }
  async agregaTrabajadorATarea(idEmpleado:string){
    const flag = await this.tarServ.postEmpleadoATarea(localStorage.getItem('token')!,this.tarea._id,idEmpleado,"").subscribe(res=>{
      if(flag){
        this.resPop.resMensajeSucBtnRedir("Tarea eliminada correctamente.","tareas")
      }else{
        this.resPop.resMensajeErrBtn("La tarea no se eliminó correctamente.")
      };});
    this.showPEmpD = false;
  }
  async muestraEmpleadosDisponibles(){
    if(this.empleadosDisp.length < 1){
      await this.empServ.getEmpleadosByTareaDist(localStorage.getItem('token')!,
        this.paramId).subscribe(res2=>{
        this.empleadosDisp=res2;
      });
    }
    this.showPEmpD = true;
  }
}
