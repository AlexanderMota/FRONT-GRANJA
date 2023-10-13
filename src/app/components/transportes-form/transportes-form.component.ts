import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehiculoModel } from 'src/app/models/vehiculo.model';

@Component({
  selector: 'app-transportes-form',
  templateUrl: './transportes-form.component.html',
  styleUrls: ['./transportes-form.component.css']
})
export class TransportesFormComponent implements OnInit {

  @Output() 
  eventoEmite = new EventEmitter<boolean>();

  //showP2:boolean = false;
  vehiculo: VehiculoModel = new VehiculoModel();
  titulo:string = "";
  textBtn:string = "";
  private paramId : string = "";

  constructor(private actRoute:ActivatedRoute) {
    this.actRoute.params.subscribe(params=>{
      //console.log(params['id']);
      if(params['id']){
        this.titulo = "Edita vehículo";
        this.textBtn = "Guardar cambios"
        this.paramId = params['id'];
        //console.log("contructor route paramid=>\n"+this.paramId);
        /*tarServ.getTareaById(localStorage.getItem('token')!,this.paramId).subscribe(res=>{
          this.tarea=res;
          //console.log("contructor route params=>\n"+res);
        });*/
      }else{
        this.titulo = "Nueva tarea";
        this.textBtn = "Crear tarea"
        /*tarServ.getTareaById(localStorage.getItem('token')!,localStorage.getItem('centroActual')!).subscribe(res=>{
          this.supers.push(res);
          //console.log("contructor route params=>\n"+res);
        });*/
      }
      
    }); 
  }

  ngOnInit(): void {
  }
  onSubmit(form:NgForm){
    /*if(!form.valid || this.tarea.importancia == "-" || this.tarea.nombre == "" || this.tarea.departamento== "-"){
      return;
    }
    this.resApi.resCargando('Espere...');
    if(this.paramId.length > 0){
      this.tarServ.patchTarea(localStorage.getItem('token')!, this.tarea!).subscribe(res => {
        switch(res.status) { 
          case 201: { 
            this.resApi.resMensajeSucBtn('Tarea creada con éxito');
             break; 
          }
          case 202: { 
            this.resApi.resMensajeSucBtn('Tarea modificada con éxito');
             break; 
          }
          case 0: { 
            this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
             break; 
          } 
          default: { 
             break; 
          } 
        }
      },(err)=>{
        this.resApi.resMensajeErrBtn(err.error.message);
      });
      
    }else{

      console.log("tarea nueva: " + this.tarea.departamento);
      console.log("idSuper: " + this.idSuper);
      this.tarServ.postTarea(localStorage.getItem('token')!, this.tarea ,this.idSuper).subscribe(res => {
        switch(res.status) { 
          case 201: { 
            this.resApi.resMensajeSucBtn('Tarea creada con éxito');
            this.resApi.resMensajeWrnBtnRedir('¿Desea especificar una ubicación para esta tarea?',"/tarea/"+res.id);
             break; 
          }
          case 400: { 
            this.resApi.resMensajeWrnBtn('Algo ha ido mal.');
             break; 
          } 
          default: { 
             //statements; 
             break; 
          } 
        } 
      },(err)=>{
        this.resApi.resMensajeErrBtn(err.error.message);
      });
    }
    
    this.eventoEmite.emit(false);*/
  }
  emiteCierraVentana(){
    this.eventoEmite.emit(false);
  }
}
