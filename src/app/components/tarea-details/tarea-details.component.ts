import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TareaService } from 'src/app/services/tarea.service';
import { Location } from '@angular/common';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
//import {  } from '../../../assets/textos/strings.json';
import { LocalizationService } from '../../services/localization.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';

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
  showParadas: boolean= false;
  visible: boolean= false;
  imps:string[] = [];
  departamentos:{nombre:string}[] = [];
  paramId : string = "";
  ubi:UbicacionModel=new UbicacionModel();
  paradas:{idUbicacion:string,fechasRecogida:{ fechaInicio: Date; fechaFin: Date; vehiculo: string}[]}={idUbicacion:"",fechasRecogida:[]};
  private rol = "";
  private permisos = ["ADMIN","Director","RRHH","Gerente","Comercial","Supervisor","Gestor","Capataz","Coordinador"];



  //@Input() oculto:boolean = false;
  botonAnadirSubtarea = "";//this.localizationService.getString("welcomeMessage");
  botonBorrar = "";//this.localizationService.getString('botones.editar');
  botonEditar = "";//this.localizationService.getString('botones.borrar');
  botonNuevoEmp = "";



  constructor(
    private tarServ:TareaService,
    private empServ: EmpleadoService,
    private ubiServ: UbicacionService,
    private actRoute:ActivatedRoute,
    private resPop:ApiResponseService,
    private localizationService: LocalizationService) {


    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        this.paramId = params['id'];
        //console.log(this.paramId);
        await this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId)
        .subscribe({next:res1=>{
          if((res1 as ApiResponse).status){
            console.log((res1 as ApiResponse).message);
          }else{
            this.tarea=res1 as TareaModel;
          }
        },error:err=>console.log(err)});
        await this.empServ.getEmpleadosByTarea(localStorage.getItem('token')!,this.paramId)
        .subscribe({next:res2=>{
          if ((res2 as ApiResponse).status){
            console.log((res2 as ApiResponse).message);
          }else{
            this.empleados=res2 as [EmpleadoModel];
          }
          //this.empleados.push({_id: 'Empleados', idEmpleado : 0, nombre : "Añadir empleado", apellidos:"",telefono:"", email:"", password:""});
        },error:err=>console.log(err)});
      }else{
        this.localizationService.getString("errorIdTareaPath").subscribe(val => {this.resPop.resMensajeErrBtn(val)});
      }
    });
    //console.log("---idTarea: " + this.tarea.nombre + "\n---ubi: " + this.ubi._id );
  }
  /*oculta(){
    this.oculto = !this.oculto;
    this.compMess.emiteDato.emit({dato:this.oculto});
  }*/

  ngOnInit(): void { 
    this.rol = localStorage.getItem('rol')!;
    this.visible = this.permisos.includes(this.rol);
    //this.resaltarRango();
    if(this.visible){
      this.localizationService.getString("botones.nuevaSubtarea").subscribe(val => {this.botonAnadirSubtarea = val});
      this.localizationService.getString('botones.editar').subscribe(val => this.botonEditar = val);
      this.localizationService.getString('botones.eliminar').subscribe(val => this.botonBorrar = val);
      this.localizationService.getString('botones.nuevoEmpleado').subscribe(val => this.botonNuevoEmp = val);
    }
  }

  async borraTarea(){
    this.resPop.resCargando('Espere...');
    await this.tarServ.deleteTarea(localStorage.getItem('token')!,this.tarea._id).subscribe({next:res=>{
      const flag = res;
      if(flag){
        this.localizationService.getString("tareaEliminadaCorrecto").subscribe(val => {this.resPop.resMensajeSucBtnRedir(val,"tareas")});
      }else{
        this.localizationService.getString("errTareaNoEliminada").subscribe(val => {this.resPop.resMensajeErrBtn(val)});
      }
    },error:err=>console.log(err)})
  }

  abreFormTarea(flag:boolean){
    this.empServ.getDepartamentos(localStorage.getItem('token')!).subscribe(res=>{
      if(res instanceof ApiResponse){
        console.log(res.message);
      }else{
        this.departamentos = res;
      }
      this.localizationService.getArray("colecciones.rangoImportancia").subscribe(val=>{this.imps = val});
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
  sendMessageFormUbi($event: {nombre:string,lng:number,lat:number}){
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
  emiteCierraVentana2(){
    this.showParadas = false;
  }
  async agregaTrabajadorATarea(idEmpleado:string){
    await this.tarServ.postEmpleadoATarea(localStorage.getItem('token')!,this.tarea._id,idEmpleado,"").subscribe(res=>{
      if(res.status < 220){
        this.localizationService.getString("mensajesInformacion.tareaEliminadaCorrecto").subscribe(val => {this.resPop.resMensajeSucBtnRedir(val,"tareas")});
      }else{
        this.localizationService.getString("errTareaNoEliminada").subscribe(val => {this.resPop.resMensajeErrBtn(val)});
      };
    });
    this.showPEmpD = false;
  }
  async muestraEmpleadosDisponibles(){
    if(this.empleadosDisp.length < 1){
      await this.empServ.getEmpleadosByTareaDist(localStorage.getItem('token')!,
        this.paramId).subscribe(res2=>{
          if((res2 as ApiResponse).status){
            console.log((res2 as ApiResponse).message);
          }else{
            this.empleadosDisp=res2 as EmpleadoModel[];
          }
      });
    }
    this.showPEmpD = true;
  }

  receiveMessageFormUbi($event: boolean){
    this.showP3 = $event;
  }
  receiveMessageEliminaParada($event:{idUbicacion:string, fechasRecogida:{ fechaInicio: Date; fechaFin: Date; vehiculo: string}[]}){
    this.paradas = $event;
    this.showParadas = true;
  }
  eliminaParada(fechaRecogida: {
    fechaInicio: Date,
    fechaFin: Date,
    vehiculo: string}){
    this.ubiServ.deleteParada(localStorage.getItem("token")!,fechaRecogida,this.paradas.idUbicacion).subscribe(val => {
      if(val.status == 200){
        this.paradas.fechasRecogida = this.paradas.fechasRecogida.filter((elemento) => {
          // Compara cada propiedad del elemento con las propiedades del elemento a eliminar
          return elemento.fechaInicio !== fechaRecogida.fechaInicio ||
                 elemento.fechaFin !== fechaRecogida.fechaFin ||
                 elemento.vehiculo !== fechaRecogida.vehiculo;
        });

      }
    });
  }
  
  receiveMessageEditaParada($event: { idUbicacion: string; titulo: string; descripcion: string; longitud: number; latitud: number; }) {
    this.ubi._id = $event.idUbicacion;
    this.ubi.titulo = $event.titulo;
    this.ubi.descripcion = $event.descripcion;
    this.ubi.longitud = $event.longitud;
    this.ubi.latitud = $event.latitud;
    console.log("idUbi antes de enviar: "+this.ubi._id);
    this.receiveMessageFormUbi(true);
  }
  // pruebas calendario parada
  /*resaltarRango(): void {
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
  }*/
}
