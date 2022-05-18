import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, UnsubscriptionError } from 'rxjs';
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

  login(usuario : UsuarioModel) {
    /*const response = this.http.post<ApiResponse>(this.urlSignIn, usuario, this.httpOptions);
    this.token = response.toPromise.apply((value)=>{
      console.log(value);
    });*/
    this.http.post<ApiResponse>(this.urlSignIn, usuario).subscribe(
      res => {
        if(res.status == 201){
          this.token = res.message;
          console.log(this.token);
        }else{
          throw UnsubscriptionError;
        }
        },(err)=>{
          console.log(err.error.message);
        }
    );
  }

  registrarEmpleado(empleado: EmpleadoModel) {
    //empleado.idEmpleado = 0;
    this.http.post<ApiResponse>(this.urlSignUp, empleado,{
      headers: new HttpHeaders({
        Authorization: (this.token == undefined ? "" : this.token  )
      })}).subscribe(
      res => {
        if(res.status == 201){
          console.log(res.message);
        }else{
          throw UnsubscriptionError;
        }
        },(err)=>{
          console.log(err.error.message);
        }
    );
  }
}
