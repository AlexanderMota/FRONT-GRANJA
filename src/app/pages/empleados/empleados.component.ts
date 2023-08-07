import { Component, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  showP : boolean= false;
  titulo="Empleados";
  posttitulo="Lista de todos los empleados en plantilla";
  nuevo="Nuevo empleado";

  empleados : EmpleadoModel[] = [];
  roles : { nombre:string }[] = [];

  constructor(private empServ:EmpleadoService) { }

  ngOnInit(): void {
    
    this.empServ.getAllEmpleados(localStorage.getItem('token')!).subscribe(res=>{
      this.empleados = res;
      this.ordenaEmpleadosNombre();
      //console.log(this.empleados);
    });
  }
  
  abreVentana(): void{
    this.empServ.getRoles(localStorage.getItem('token')!).subscribe(res=>{
      this.roles = res;
      //console.log(res);
    });
    this.showP = true;
  }
  
  receiveMessage($event: boolean){
    this.showP = $event;
  }
  ordenaEmpleadosNombre(){
    this.empleados.sort((a, b) => {
      const nameA = a.nombre.toLowerCase();
      const nameB = b.nombre.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  ordenaEmpleadosRol(){
    this.empleados.sort((a, b) => {
      const nameA = a.rol.nombre.toLowerCase();
      const nameB = b.rol.nombre.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
}
