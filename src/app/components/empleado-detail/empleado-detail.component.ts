import { Component, Input, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';

@Component({
  selector: 'app-empleado-detail',
  templateUrl: './empleado-detail.component.html',
  styleUrls: ['./empleado-detail.component.css']
})
export class EmpleadoDetailComponent implements OnInit {
  
  @Input() empleado:EmpleadoModel = new EmpleadoModel();
  constructor() { }

  ngOnInit(): void {
  }

}
