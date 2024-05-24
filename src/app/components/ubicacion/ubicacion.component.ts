import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaModel } from 'src/app/models/tarea.model';
import { TareaService } from 'src/app/services/tarea.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {

  private idTarea : string = "";
  subtareas : TareaModel[] = [];

  ngOnInit(): void {
  }
}
