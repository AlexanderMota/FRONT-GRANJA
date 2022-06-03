import { Component, Input, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';

@Component({
  selector: 'app-empleado-card',
  templateUrl: './empleado-card.component.html',
  styleUrls: ['./empleado-card.component.css']
})
export class EmpleadoCardComponent implements OnInit {

  @Input() empleado:EmpleadoModel = new EmpleadoModel();
  @Input() index:number = 0;
  
  constructor() { 
    //console.log(this.index + "-" + this.empleado);
  }

  ngOnInit(): void {
    //this.empleado = this.empleado;
  }

}
