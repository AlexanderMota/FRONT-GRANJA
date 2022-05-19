import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {

  titulo="Tareas";
  posttitulo="Lista de todas las tareas disponibles";
  //heroes:Heroe[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
