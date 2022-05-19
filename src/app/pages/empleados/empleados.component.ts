import { Component, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  private empleados : EmpleadoModel[] = [];

  constructor(private empServ:EmpleadoService) { }

  ngOnInit(): void {
    
    this.empServ.getAllEmpleados(localStorage.getItem('token')!).subscribe(res=>{
      this.empleados = res;
      console.log(this.empleados);
    });
  }
}
