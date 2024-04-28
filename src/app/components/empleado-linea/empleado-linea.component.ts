import { Component, Input, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';

@Component({
  selector: 'app-empleado-linea',
  templateUrl: './empleado-linea.component.html',
  styleUrls: ['./empleado-linea.component.css']
})
export class EmpleadoLineaComponent implements OnInit {
  @Input() 
  emp: EmpleadoModel = new EmpleadoModel();
  @Input() 
  index:number = 0;
  constructor() {
   }

  ngOnInit(): void {
  }
}
