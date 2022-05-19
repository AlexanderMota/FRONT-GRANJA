import { Component, OnInit } from '@angular/core';
import { TareaModel } from 'src/app/models/tarea.model';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  titulo="Tareas";
  posttitulo="Lista de todas las tareas disponibles";
  tareas:TareaModel[] = [];

  constructor(private tarServ:TareaService) { }

  ngOnInit(): void {
    
    this.tarServ.getAllTareas(localStorage.getItem('token')!).subscribe(res=>{
      this.tareas = res;
      console.log(this.tareas);
    });
  } 
}
