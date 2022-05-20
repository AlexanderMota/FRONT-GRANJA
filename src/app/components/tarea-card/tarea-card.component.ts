import { Component, Input, OnInit } from '@angular/core';
import { TareaModel } from 'src/app/models/tarea.model';

@Component({
  selector: 'app-tarea-card',
  templateUrl: './tarea-card.component.html',
  styleUrls: ['./tarea-card.component.css']
})
export class TareaCardComponent implements OnInit {

  @Input() tarea:TareaModel = new TareaModel();
  //@Input() index:number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
