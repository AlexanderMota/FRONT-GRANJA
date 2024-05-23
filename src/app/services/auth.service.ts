import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  } from 'rxjs';
//import { NavbarComponent } from '../components/navbar/navbar.component';
import { ApiResponse } from '../models/apiResponse.model';
import { EmpleadoModel } from '../models/empleado.model';
import { UsuarioModel } from '../models/usuario.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //vis = "visible";
  private horaCon : Date = new Date();

  constructor(private http: HttpClient/*, private nav : NavbarComponent*/) { }
  //Token caducado pruebas: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsZWFkbyI6eyJub21icmUiOiJhZG1pbiIsInJvbCI6IkFETUlOIn0sImlhdCI6MTcxMzUxODAyNiwiZXhwIjoxNzEzNTIxNjI2fQ.VNvX_1HwMNkMnPL8prqO7VytdvOofxYXJfQkiNUNkk8
  
  //private urlTokenValido = 'https://api-granja.azurewebsites.net/api/auth';
  private urlTokenValido = 'http://localhost:4300/api/auth';

  //Crear nuevo usuario
  //private urlSignUp = 'https://api-granja.azurewebsites.net/api/auth/signup';
  private urlSignUp = this.urlTokenValido+'/signup';
  
  //Login
  //private urlSignIn = 'https://api-granja.azurewebsites.net/api/auth/signin';
  private urlSignIn = this.urlTokenValido+'/signin';

  private urlGetMyUser = this.urlTokenValido+'/myuser';


  logout(){
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    localStorage.removeItem('fintoken');
    localStorage.removeItem('miid');
    localStorage.removeItem('centroActual');
    //this.vis = "collapse";
  }

  login(usuario : UsuarioModel) : Observable<ApiResponse>{
    //this.vis = "visible";
    this.horaCon = new Date(Date.now());
    localStorage.setItem("fintoken",this.horaCon.getTime().toString());
    return this.http.post<ApiResponse>(this.urlSignIn, usuario);
  }

  registrarEmpleado(token:string,empleado: EmpleadoModel):Observable<ApiResponse> {
    const {nombre,apellidos,telefono,email,password,rol,centroTrabajo} = empleado
    return this.http.post<ApiResponse>(this.urlSignUp, {nombre,apellidos,telefono,email,password,rol,centroTrabajo},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }
  esAutenticado():boolean{
    if(localStorage.getItem('token')){
      const expira = Number(localStorage.getItem("fintoken"));
      const expiraDate = new Date();
      expiraDate.setTime(expira);

      if(expiraDate > new Date()){
        this.logout();

        return true;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }
  compruebaTokenValido():Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.urlTokenValido + "?token="+localStorage.getItem('token')!,"");
  }
  getMyUser(mail:string):Observable<EmpleadoModel | ApiResponse>{
    return this.http.get<EmpleadoModel | ApiResponse>(this.urlGetMyUser+"/"+mail, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')!
      })
    });
  }
}
