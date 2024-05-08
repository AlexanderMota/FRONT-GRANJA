import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { ApiResponseService } from 'src/app/services/api-response.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  private rol="";
  private permisos = ["ADMIN", "Director", "RRHH","Gerente"];

  visible = false;
  showP : boolean= false;
  titulo="Empleados";
  posttitulo="Lista de todos los empleados en plantilla";
  nuevo="Nuevo empleado";
  pagina = 1;
  tamañoPag = 10;
  botonIzq: HTMLButtonElement = document.getElementById("botonIzq")as HTMLButtonElement;
  botonDer: HTMLButtonElement = document.getElementById("botonDer")as HTMLButtonElement;

  empleados : EmpleadoModel[] = [];
  //roles:string[] = [];

  constructor(private empServ:EmpleadoService,
    private authServ:AuthService,
    private respServ : ApiResponseService ) { }

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol')!;
    this.visible = this.permisos.includes(this.rol);
    /*if (this.pagina <= 1) {
      this.botonIzq!.disabled = true;
    } else {
      this.botonIzq!.disabled = false;
    }*/
    this.empServ.getAllEmpleados(localStorage.getItem('token')!,this.tamañoPag,this.pagina).subscribe({next:res=>{
      if((res as ApiResponse).status){
        console.log((res as ApiResponse).message);
        if((res as ApiResponse).status == 420){
          this.authServ.logout();
          this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
          this.authServ.logout();
        }
      }else if((res as EmpleadoModel[]).length > 0){
        this.empleados = res as EmpleadoModel[];
        this.ordenaEmpleadosNombre();
      }
      //console.log(this.empleados);
    },error:err=>{
      switch(err.error.status) { 
        case 420: { 
          this.authServ.logout();
          this.respServ.resMensajeErrBtnRedir("La sesión ha expirado. Vuelva a iniciar sesion.","/");
          this.authServ.logout();
          break; 
        } 
        /*case 404: { 
          this.respServ.resMensajeErrBtn("No hay tareas en este centro.");
            break; 
        } */
        default: { 
          this.respServ.resMensajeWrnBtn("Algo ha ido mal.");
            //statements; 
            break; 
        } 
      }
    }});
  }
  
  abreVentana(): void{
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
          if((res as ApiResponse).status){
            console.log((res as ApiResponse).message);
          }else{
            this.empleados = res as EmpleadoModel[];
          }
          this.ordenaEmpleadosNombre();
          //console.log(this.empleados);
        },error:err=>{console.log(err)}});
      }
    }else if(move > 0){
      this.pagina += move;
      //console.log(this.tamañoPag," - ",this.pagina);
      this.empServ.getAllEmpleados(localStorage.getItem('token')!,this.tamañoPag,this.pagina).subscribe({next:res=>{
        
        if((res as ApiResponse).status){
          console.log((res as ApiResponse).message);
        }else{
          if((res as EmpleadoModel[]).length < 1){
            this.pagina -= move;
          }else{
            this.empleados = res as EmpleadoModel[];
            this.ordenaEmpleadosNombre();
            //console.log(this.empleados);
          }
        }
        //console.log(this.empleados);
      },error:err=>{console.log(err)}});
    }
  }
}
