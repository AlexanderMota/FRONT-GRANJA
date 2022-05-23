import { Component, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  titulo="Lista de empleados";
  posttitulo="Lista de todos los empleados en plantilla";
  empleados : EmpleadoModel[] = [];

  constructor(private empServ:EmpleadoService) { }

  ngOnInit(): void {
    
    this.empServ.getAllEmpleados(localStorage.getItem('token')!).subscribe(res=>{
      this.empleados = res;
      //console.log(this.empleados);
    });
  }
}
