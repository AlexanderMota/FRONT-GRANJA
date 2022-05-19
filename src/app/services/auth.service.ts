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

  vis = "visible";
  private token : string ="";

  //Crear nuevo usuario
  //private urlSignUp = 'https://api-granja.azurewebsites.net/api/auth/signup';
  private urlSignUp = 'http://localhost:4300/api/auth/signup';
  
  //Login
  //private urlSignIn = 'https://api-granja.azurewebsites.net/api/auth/signin';
  private urlSignIn = 'http://localhost:4300/api/auth/signin';

  //Token valido
  //private urlTokenValido = 'https://api-granja.azurewebsites.net/api/auth';
  private urlTokenValido = 'http://localhost:4300/api/auth';
  constructor(private http: HttpClient/*, private nav : NavbarComponent*/) { }

  logout(){
    localStorage.removeItem('token');
    this.token = "";
    this.vis = "collapse";
  }

  login(usuario : UsuarioModel) : Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.urlSignIn, usuario);
  }

  registrarEmpleado(empleado: EmpleadoModel):Observable<ApiResponse> {
    empleado.idEmpleado = 0;
    let stt : Number = 0;
    return this.http.post<ApiResponse>(this.urlSignUp, empleado,{
      headers: new HttpHeaders({
        Authorization: this.token
      })
    });
  }

  guardaToken(token:string){
    this.token = token;
    localStorage.setItem('token',token);
    this.vis = "visible";
  }
  esAutenticado():boolean{
    if(localStorage.getItem('token')){
      return localStorage.getItem('token')!.length > 0;
    }else{
      return this.token.length > 0;
    }
  }
  conpruebaTokenValido():Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.urlTokenValido + "?token="+localStorage.getItem('token')!,"");
  }
  getToken():string{
    return this.token;
  }
}
