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
  showP1 : boolean= false;
  showP2 : boolean= false;
  showP3 : boolean= false;
  flag : boolean= false;
  showPEmpD : boolean= false;
  imps:string[] = [];
  departamentos:{nombre:string}[] = [];
  paramId : string = "";
  ubi:UbicacionModel=new UbicacionModel();

  //@Input() oculto:boolean = false;

  constructor(
    private tarServ:TareaService,
    private empServ: EmpleadoService,
    private actRoute:ActivatedRoute,
    private resPop:ApiResponseService) {
    
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        this.paramId = params['id'];
        console.log(this.paramId);
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
        console.log("algo ha ido mal al cargar la tarea");
      }
    });
    //console.log("---idTarea: " + this.tarea.nombre + "\n---ubi: " + this.ubi._id );
  }
  /*oculta(){
    this.oculto = !this.oculto;
    this.compMess.emiteDato.emit({dato:this.oculto});
  }*/

  ngOnInit(): void { 
    this.resaltarRango();
  }

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

  abreFormTarea(flag:boolean){
    this.empServ.getDepartamentos(localStorage.getItem('token')!).subscribe(res=>{
      this.departamentos = res;
      this.imps = ["Crítica","Alta","Media","Baja"];
      //console.log(res);
    });
    this.flag = flag;
    this.showP1 = true;
  }
  /*abreFormTransporte(){
    this.showP2 = true;
  }*/
  
  receiveMessageFormTarea($event: boolean){
    this.showP1 = $event;
  }
  receiveMessageFormVehi($event: boolean){
    //console.log("receiveMessageFormVehi: "+$event);
    this.showP2 = $event;
  }
  receiveMessageFormUbi($event: {nombre:string,lng:number,lat:number}){
    //console.log($event);
    this.ubi.titulo = $event.nombre;
    this.ubi.longitud = $event.lng;
    this.ubi.latitud = $event.lat;
    this.showP3 = true;
  }
  /*receiveMessageFormUbi($event: boolean){
    this.showP3 = $event;
  }*/
  emiteCierraVentana(){
    this.showPEmpD = false;
    
    location.reload();
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


  
  // pruebas calendario parada
  resaltarRango(): void {
    // Obtener la fecha de inicio y fin del rango deseado
    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-10');

    // Obtener el elemento de fecha
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;

    // Función para formatear la fecha en formato 'YYYY-MM-DD'
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    };

    // Iterar sobre los días en el rango y aplicar estilos
    const dates = dateInput.querySelectorAll<HTMLInputElement>('input[type="date"]');
    dates.forEach(date => {
      const dateValue = new Date(date.value);
      if (dateValue >= startDate && dateValue <= endDate) {
        date.style.backgroundColor = 'yellow';
      }
    });
  }
}
