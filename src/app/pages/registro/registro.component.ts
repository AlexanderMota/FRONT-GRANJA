import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmpleadoModel } from '../../models/empleado.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  empleado: EmpleadoModel;

  constructor(private auth:AuthService) { }

  ngOnInit() { 
    this.empleado = new EmpleadoModel();

    this.empleado.nombre = "FRONT";
    this.empleado.apellidos = "ANGULAR";
    this.empleado.email = "angular@front.com";
    this.empleado.password = "123";

  }
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    console.log("formulario enviado \n" + this.empleado.nombre + "\nNgFomr: " + form.valid);
    
    this.auth.registrarEmpleado(this.empleado);
  }

}
