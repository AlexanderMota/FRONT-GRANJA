import { Component, Input, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';

@Component({
  selector: 'app-empleado-linea',
  templateUrl: './empleado-linea.component.html',
  styleUrls: ['./empleado-linea.component.css']
})
export class EmpleadoLineaComponent implements OnInit {
  @Input() empleado: EmpleadoModel = new EmpleadoModel();
  @Input() index:number = 0;
  constructor() {
    console.log(this.empleado);
   }

  ngOnInit(): void {
  }

}
