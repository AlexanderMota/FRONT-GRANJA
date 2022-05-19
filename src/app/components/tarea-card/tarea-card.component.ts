import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarea-card',
  templateUrl: './tarea-card.component.html',
  styleUrls: ['./tarea-card.component.css']
})
export class TareaCardComponent implements OnInit {

  @Input() tarea:any = {};
  @Input() index:number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
