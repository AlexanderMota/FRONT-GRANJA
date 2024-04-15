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

  vis = "novisible";
  private token : string ="";
  private horaCon : Date = new Date();

  constructor(private http: HttpClient/*, private nav : NavbarComponent*/) { }

  //Token valido
  //private urlTokenValido = 'https://api-granja.azurewebsites.net/api/auth';
  private urlTokenValido = 'http://localhost:4300/api/auth';

  //Crear nuevo usuario
  //private urlSignUp = 'https://api-granja.azurewebsites.net/api/auth/signup';
  private urlSignUp = this.urlTokenValido+'/signup';
  
  //Login
  //private urlSignIn = 'https://api-granja.azurewebsites.net/api/auth/signin';
  private urlSignIn = this.urlTokenValido+'/signin';

  private urlGetMiId = this.urlTokenValido+'/miid';


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('fintoken');
    this.token = "";
    this.vis = "collapse";
  }

  login(usuario : UsuarioModel) : Observable<ApiResponse>{
    this.horaCon = new Date(Date.now());
    localStorage.setItem("fintoken",this.horaCon.getTime().toString());
    //onsole.log(this.horaCon);
    return this.http.post<ApiResponse>(this.urlSignIn, usuario);
  }

  registrarEmpleado(token:string,empleado: EmpleadoModel):Observable<ApiResponse> {
    //empleado.idEmpleado = 0;
    //console.log(empleado);
    const {nombre,apellidos,telefono,email,password,rol} = empleado
    return this.http.post<ApiResponse>(this.urlSignUp, {nombre,apellidos,telefono,email,password,rol},{
      headers: new HttpHeaders({
        Authorization: token
      })
    });
  }

  /*guardaRol(rol:string){
    localStorage.setItem('rol',rol);
  }*/
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
  getMiId(mail:string){
    return this.http.get<ApiResponse>(this.urlGetMiId, {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')!
      }),
      params: {
        mail
      }
    });
  }
}
