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

  empleado: EmpleadoModel | undefined;

  constructor(private auth:AuthService) { }

  ngOnInit() { 
    this.empleado = new EmpleadoModel();
  } 
  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    console.log("formulario enviado \n" + this.empleado!.nombre + "\nNgFomr: " + form.valid);
    
    this.auth.registrarEmpleado(this.empleado!);
  }

}
