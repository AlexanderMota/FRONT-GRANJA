import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { TareaModel } from 'src/app/models/tarea.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
//import { AuthService } from 'src/app/services/auth.service';
//import { ComentarioService } from 'src/app/services/comentario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TareaService } from 'src/app/services/tarea.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { UbicacionModel } from 'src/app/models/ubicacion.model';
import { LocalizationService } from '../../services/localization.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { SolicitudService } from 'src/app/services/solicitud.service';
//import { MapaComponent } from 'src/app/components/mapa/mapa.component';


@Component({
  selector: 'app-tarea-details',
  templateUrl: './tarea-details.component.html',
  styleUrls: ['./tarea-details.component.css']
})
export class TareaDetailsComponent implements OnInit {
  tarea: TareaModel = new TareaModel();
  ubi:UbicacionModel=new UbicacionModel();
  comentarios: ComentarioModel[] = [];
  empleados: {nombre:string, id:string}[] = [];
  empleadosDisp: {nombre:string, id:string}[] = [];
  showP1 : boolean= false;
  showP2 : boolean= false;
  showP3 : boolean= false;
  editaTar : boolean= false;
  showPEmpD : boolean= false;
  showParadas: boolean= false;
  visible: boolean= false;
  nuevaTarUbi: boolean= false;
  numEmp=0;
  numeroTrabajadores=0;
  paramId : string = "";
  paradas:{idUbicacion:string,fechasRecogida:{ 
    fechaInicio: Date; fechaFin: Date; vehiculo: string}[]
  }={idUbicacion:"",fechasRecogida:[]};
  
  botonAnadirSubtarea = "";//this.localizationService.getString("welcomeMessage");
  botonBorrar = "";//this.localizationService.getString('botones.editar');
  botonEditar = "";//this.localizationService.getString('botones.borrar');
  botonNuevoEmp = "";
  fechaIni = "";
  
  private rol = "";
  private permisos = ["ADMIN","Director","RRHH","Gerente","Comercial","Supervisor","Gestor","Capataz","Coordinador"];


  constructor(
    private tarServ:TareaService,
    private solServ: SolicitudService,
    private empServ: EmpleadoService,
    private ubiServ: UbicacionService,
    private actRoute:ActivatedRoute,
    private resPop:ApiResponseService,
    private locServ: LocalizationService) {
      this.numeroTrabajadores = 0;
  }

  ngOnInit(): void { 
    this.inicia();
    this.rol = localStorage.getItem('rol')!;
    this.visible = this.permisos.includes(this.rol);
    if(this.visible){
      this.locServ.getString("botones.nuevaSubtarea").subscribe(val => {this.botonAnadirSubtarea = val});
      this.locServ.getString('botones.editar').subscribe(val => this.botonEditar = val);
      this.locServ.getString('botones.eliminar').subscribe(val => this.botonBorrar = val);
      this.locServ.getString('botones.nuevoEmpleado').subscribe(val => this.botonNuevoEmp = val);
    }
  }
  private inicia(){
    this.actRoute.params.subscribe(async params=>{
      if(params['id']){
        this.paramId = params['id'];
        //console.log(this.paramId);
        await this.tarServ.getTareaById(localStorage.getItem('token')!,this.paramId)
        .subscribe({next:res1=>{
          this.numeroTrabajadores = 0;

          if((res1 as ApiResponse).status){
            console.log((res1 as ApiResponse).message);
          }else{
            this.tarea=res1 as TareaModel;
            this.tarea.plantilla.forEach(val => {
              this.numeroTrabajadores += val.cantidad;
            });
            
            let fech = this.tarea.fechainicio.toString();
            this.tarea.fechainicio = new Date(fech.slice(0,19));
            this.fechaIni = fech.slice(0,19);
          }
        },error:err=>console.log(err)});
        await this.empServ.getEmpleadosByTarea(localStorage.getItem('token')!,this.paramId)
        .subscribe({next:res2=>{
          this.empleados = [];
          if ((res2 as ApiResponse).status){
            if((res2 as ApiResponse).status == 201){
              this.numEmp = parseInt( (res2 as ApiResponse).message);
              console.log((res2 as ApiResponse).message);
            }else console.log((res2 as ApiResponse).message);
            
          }else{
            this.numEmp = (res2 as EmpleadoModel[]).length;
            (res2 as EmpleadoModel[]).forEach(val => this.empleados.push({
              nombre:val.nombre + " " + val.apellidos,id:val._id.toString()
            }));
          }
        },error:err=>console.log(err)});
      }else this.locServ.getString("errorIdTareaPath")
        .subscribe(val => {this.resPop.resMensajeErrBtn(val)});
    });
  }
  borraTarea(){ this.borraTareaPri(); }
  private async borraTareaPri(){
    this.resPop.resCargando('Espere...');
    await this.tarServ.deleteTarea(localStorage.getItem('token')!,this.tarea._id,0).subscribe({next:res=>{
      console.log(res);
      if(res.status < 220) this.resPop.resMensajeSucBtnRedir(res.message,"tareas") //this.locServ.getString("tareaEliminadaCorrecto").subscribe(val =>this.resPop.resMensajeSucBtnRedir(val,"tareas"));
      else if(res.status > 400) this.resPop.resMensajeErrBtn(res.message) //this.locServ.getString("errTareaNoEliminada").subscribe(val => this.resPop.resMensajeErrBtn(val));
      else this.resPop.resMensajeErrBtn(res.message)
      
    },error:err=>this.resPop.resMensajeErrBtn(err)})
  }
  abreFormTarea(flag:boolean){ this.abreFormTareaPri(flag); }
  private abreFormTareaPri(flag:boolean){
    this.editaTar = flag;
    this.showP1 = true;
  }
  agregaTrabajadorATarea(idEmpleado:string){ this.agregaTrabajadorATareaPri(idEmpleado); }
  private async agregaTrabajadorATareaPri(idEmpleado:string){
    await this.tarServ.postEmpleadoATarea(localStorage.getItem('token')!,this.tarea._id,idEmpleado,"").subscribe(res=>{
      if(res.status < 220){
        console.log(res.message);
        this.locServ.getString("mensajesInformacion.tareaEliminadaCorrecto").subscribe(val => this.resPop.resMensajeSucBtnRedir(val,"tareas"));
      }else{
        console.log(res.message);
        this.locServ.getString("errTareaNoEliminada").subscribe(val => this.resPop.resMensajeErrBtn(val));
      };
    });
    this.showPEmpD = false;
  }
  muestraEmpleadosDisponibles(){ this.muestraEmpleadosDisponiblesPri(); }
  private async muestraEmpleadosDisponiblesPri(){
    if(this.empleadosDisp.length < 1){
      await this.empServ.getEmpleadosByTareaDist(
        localStorage.getItem('token')!,this.paramId).subscribe(res2=>{
          if((res2 as ApiResponse).status) console.log((res2 as ApiResponse).message);
          else (res2 as EmpleadoModel[]).forEach(val => this.empleadosDisp.push({
            nombre:val.nombre + " " + val.apellidos,id:val._id.toString()
          }));
        }
      );
    }
    this.showPEmpD = true;
  }
  /*abreFormTransporte(){
    this.showP2 = true;
  }*/
  
  emiteCierraVentana(){
    this.showPEmpD = false;
    location.reload();
  }
  emiteCierraVentana2(){ this.showParadas = false; }
  sendMessageFormUbi($event: {nombre:string,lng:number,lat:number}){
    console.log("aqui");
    this.ubi.titulo = $event.nombre;
    this.ubi.longitud = $event.lng;
    this.ubi.latitud = $event.lat;
    this.nuevaTarUbi = false;
    this.showP3 = true;
  }
  receiveMessageFormTarea($event: boolean){ this.showP1 = $event; }
  receiveMessageFormVehi($event: boolean){ this.showP2 = $event; }
  receiveMessageFormUbi($event: boolean){ this.showP3 = $event; }
  receiveMessageEliminaParada($event:{idUbicacion:string, fechasRecogida:{ fechaInicio: Date; fechaFin: Date; vehiculo: string}[]}){
    this.paradas = $event;
    this.showParadas = true;
  }
  receiveMessageEditaParada($event: { idUbicacion: string; titulo: string; descripcion: string; longitud: number; latitud: number; }) {
    this.ubi._id = $event.idUbicacion;
    this.ubi.titulo = $event.titulo;
    this.ubi.descripcion = $event.descripcion;
    this.ubi.longitud = $event.longitud;
    this.ubi.latitud = $event.latitud;
    //console.log("idUbi antes de enviar: "+this.ubi._id);
    this.receiveMessageFormUbi(true);
  }
  receiveMessageEliminaEmpleadoTarea($event: string) { this.eliminaEmpleadoTarea($event); }
  private eliminaEmpleadoTarea(emp: string){
    this.tarServ.deleteEmpleadoTarea(localStorage.getItem('token')!,this.tarea._id,emp).subscribe({next:res=>{
      if(res.status < 220) this.resPop.resMensajeSucBtn(res.message)
      else if(res.status > 400) this.resPop.resMensajeErrBtn(res.message)
    },error:err => this.resPop.resMensajeErrBtn(err)/*console.log(err)*/});
  }
  receiveMessageIdTareaUbi($event:string){
    this.ubi.idTarea = $event;
    this.nuevaTarUbi = true;
  }
  eliminaParada(fechaRecogida: {
    fechaInicio: Date,
    fechaFin: Date,
    vehiculo: string}){
      this.eliminaParadaPri(fechaRecogida);
  }
  private eliminaParadaPri(fechaRecogida: {
    fechaInicio: Date,
    fechaFin: Date,
    vehiculo: string}){
    this.ubiServ.deleteParada(localStorage.getItem("token")!,fechaRecogida,this.paradas.idUbicacion).subscribe({next:val => {
      if(val.status == 200 || val.status == 201 || val.status == 202){
        console.log(val.message);
        this.paradas.fechasRecogida = this.paradas.fechasRecogida.filter((elemento) => {
          return elemento.fechaInicio !== fechaRecogida.fechaInicio ||
                 elemento.fechaFin !== fechaRecogida.fechaFin ||
                 elemento.vehiculo !== fechaRecogida.vehiculo;
        });
      }else{
        console.log(val.status,": ",val.message);
        this.resPop.resMensajeWrnBtn(val.message);
      }
    },error:err => this.resPop.resMensajeWrnBtn(err)});
  }
  solicitarTarea(){ this.solicitarTareaPri(); }
  private solicitarTareaPri(){
    this.solServ.postSolicitud(localStorage.getItem("token")!,
      this.tarea._id,localStorage.getItem("miid")!).subscribe({next:res=>{
      if(res.status < 220){
        console.log(res.message);
        this.locServ.getString("mensajesInformacion.202solicitaTarea").subscribe(val => this.resPop.resMensajeSucBtn(val));
      }else{
        console.log(res.message);
        this.locServ.getString("mensajesError.402solicitaTarea").subscribe(val => this.resPop.resMensajeErrBtn(val));
      }
    },error:err=>console.log(err)});
  }
}
