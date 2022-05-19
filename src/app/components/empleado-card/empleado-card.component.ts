import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empleado-card',
  templateUrl: './empleado-card.component.html',
  styleUrls: ['./empleado-card.component.css']
})
export class EmpleadoCardComponent implements OnInit {

  @Input() heroe:any = {};
  @Input() index:number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }

}
