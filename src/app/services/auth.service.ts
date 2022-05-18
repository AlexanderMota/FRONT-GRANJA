import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, UnsubscriptionError } from 'rxjs';
import Swal from 'sweetalert2';
import { ApiResponse } from '../models/apiResponse.model';
import { EmpleadoModel } from '../models/empleado.model';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token : string | undefined;

  //Crear nuevo usuario
  private urlSignUp = 'http://localhost:4300/api/auth/signup';
  
  //Login
  private urlSignIn = 'http://localhost:4300/api/auth/signin';

  constructor(private http: HttpClient) { }

  logout(){

  }

  login(usuario : UsuarioModel) : Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.urlSignIn, usuario);
  }

  registrarEmpleado(empleado: EmpleadoModel):Observable<ApiResponse> {
    empleado.idEmpleado = 0;
    let stt : Number = 0;
    return this.http.post<ApiResponse>(this.urlSignUp, empleado,{
      headers: new HttpHeaders({
        Authorization: (this.token == undefined ? "" : this.token  )
      })
    });
  }

  guardaToken(token:string){
    this.token = token;
  }
}
