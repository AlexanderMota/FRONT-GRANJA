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
  fechainiciolocal:string = this.tarea.fechainicio.getDate() +"/"+(this.tarea.fechainicio.getMonth() + 1) +"/"+this.tarea.fechainicio.getFullYear() ;
  constructor() {
    this.fechainiciolocal = this.tarea.fechainicio.getDate() +"/"+(this.tarea.fechainicio.getMonth() + 1) +"/"+this.tarea.fechainicio.getFullYear() ;
   }

  ngOnInit(): void {
    if(this.tarea.descripcion.length > 50){
      this.tarea.descripcion = (this.tarea.descripcion.slice(0,50) + "...");
      this.fechainiciolocal = this.tarea.fechainicio.getDate() +"/"+(this.tarea.fechainicio.getMonth() + 1) +"/"+this.tarea.fechainicio.getFullYear() ;
    }
  }
}
