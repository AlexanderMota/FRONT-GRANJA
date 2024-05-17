import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';

@Component({
  selector: 'app-empleado-linea',
  templateUrl: './empleado-linea.component.html',
  styleUrls: ['./empleado-linea.component.css']
})
export class EmpleadoLineaComponent implements OnInit {
  @Output()
  private eventoEmiteEliminaEmpleadoTarea= new EventEmitter<string>();

  @Input() 
  emp: { nombre: string; id: string; } = {nombre:"",id:""};
  @Input() 
  index:number = 0;

  ngOnInit(): void { }
  eliminaEmpleadoTarea(){
    this.eventoEmiteEliminaEmpleadoTarea.emit(this.emp.id);
  }
}
