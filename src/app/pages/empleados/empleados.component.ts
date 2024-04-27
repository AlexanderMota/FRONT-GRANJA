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
  pagina = 1;
  tamañoPag = 20;
  botonIzq: HTMLButtonElement = document.getElementById("botonIzq")as HTMLButtonElement;
  botonDer: HTMLButtonElement = document.getElementById("botonDer")as HTMLButtonElement;

  empleados : EmpleadoModel[] = [];
  roles : { nombre:string }[] = [];

  constructor(private empServ:EmpleadoService) { }

  ngOnInit(): void {
    /*if (this.pagina <= 1) {
      this.botonIzq!.disabled = true;
    } else {
      this.botonIzq!.disabled = false;
    }*/
    this.empServ.getAllEmpleados(localStorage.getItem('token')!).subscribe({next:res=>{
      this.empleados = res;
      this.ordenaEmpleadosNombre();
      //console.log(this.empleados);
    },error:err=>{}});
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
      const nameA = a.rol.toLowerCase();
      const nameB = b.rol.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  cambiaPaginaEmpleado(move:number){
    //console.log(move);
    if(move < 0){
      if(this.pagina > 1){
        this.pagina += move;
        //console.log(this.tamañoPag," - ",this.pagina);
        this.empServ.getAllEmpleados(localStorage.getItem('token')!,this.tamañoPag,this.pagina).subscribe({next:res=>{
          this.empleados = res;
          this.ordenaEmpleadosNombre();
          //console.log(this.empleados);
        },error:err=>{console.log(err)}});
      }
    }else if(move > 0){
      this.pagina += move;
      //console.log(this.tamañoPag," - ",this.pagina);
      this.empServ.getAllEmpleados(localStorage.getItem('token')!,this.tamañoPag,this.pagina).subscribe({next:res=>{
        if(res.length < 1){
          this.pagina -= move;
        }else{
          this.empleados = res;
          this.ordenaEmpleadosNombre();
          //console.log(this.empleados);
        }
        //console.log(this.empleados);
      },error:err=>{console.log(err)}});
    }
  }
}
