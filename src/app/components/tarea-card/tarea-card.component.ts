import { Component, Input, OnInit } from '@angular/core';
import { TareaModel } from 'src/app/models/tarea.model';

@Component({
  selector: 'app-tarea-card',
  templateUrl: './tarea-card.component.html',
  styleUrls: ['./tarea-card.component.css']
})
export class TareaCardComponent implements OnInit {

  @Input() tarea:TareaModel = new TareaModel();
  @Input() index:number = 0;
  title : string = "";
  descRes : string = "";
  fechamostrar : string = this.tarea.fechainicio.toLocaleDateString();;
  fechainiciolocal:string = this.tarea.fechainicio.getDate() +"/"+(this.tarea.fechainicio.getMonth() + 1) +"/"+this.tarea.fechainicio.getFullYear() ;
  constructor() {
  }

  ngOnInit(): void {
    if(this.tarea.nombre.length > 15){
      this.title = (this.tarea.nombre.slice(0,15) + "...");
    }else{
      this.title = this.tarea.nombre;
    }
    if(this.tarea.descripcion.length > 75){
      this.descRes = (this.tarea.descripcion.slice(0,75) + "...");
    }
    if(this.descRes.length < 1){
      this.descRes = "Tarea sin descripción."
    }
  }
}