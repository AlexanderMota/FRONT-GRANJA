import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})

export class ApiResponseService {
  public static icons =  [
    "warning", "error", "success", "info", "question"
  ]
  constructor(private router:Router) { }

  resMensajeSucBtn(msn:string, recarga = false){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'success'
    }).then(() => {if(recarga){location.reload()}});
  }
  resMensajeSucBtnRedir(msn:string,redir:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'success'
    }).then((result)=>{
      if (result.isConfirmed) {
        this.router.navigateByUrl(redir);
      }
    });
  }
  resMensajeQuesBtnCancBtn(titulo:string,
    msn:string,btnAccTxt:string,
    btnCancel:boolean,btnCancTxt:string):Promise<SweetAlertResult<any>>{
    return Swal.fire({
      title: titulo,
      text: msn,
      icon: "question",
      showCancelButton: btnCancel,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: btnAccTxt,
      cancelButtonText: btnCancTxt,
    })
  }

  /*'text'`, `'email'`, `'password'`, `'number'`, `'tel'`, `'range'`, `'textarea'`,
  `'select'`, `'radio'`, `'checkbox'`, `'file'` and `'url'`.*/

  async resMensajeInputSelect(titulo:string,
    msn:string,btnAccTxt:string,
    btnCancel:boolean,btnCancTxt:string,opciones:Array<string>):Promise<string>{
    const { value } = await Swal.fire({
      title: titulo,
      text: msn,
      input: "select",
      showCancelButton: btnCancel,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: btnAccTxt,
      cancelButtonText: btnCancTxt,
      inputOptions:opciones,
      inputLabel: "Vehículo: "
       

    });
    if (value) {
      return value;
    }else{
      return "";
    }
  }


  resMensajeErrBtn(msn:string, recarga = false){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'error'
    }).then(() => {if(recarga){location.reload()}});
  }
  resMensajeErrBtnRedir(msn:string,redir:string){

    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'error'
    }).then((result)=>{
      if (result.isConfirmed) {
        this.router.navigateByUrl(redir);
      }
    });
  }

  resMensajeWrnBtn(msn:string,accText = "Aceptar",btnCnc = false, cncText = "Cancelar"){
    return Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'warning',
      showCancelButton: btnCnc,
      cancelButtonText: cncText,
      confirmButtonText: accText
    });
  }
  
  resMensajeWrnBtnRedir(msn:string,redir:string){
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'warning',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result)=>{
      if (result.isConfirmed) {
        this.router.navigateByUrl(redir);
      }else{
        console.log('Botón Cancelar presionado');
      }
    });
  }
  resMensajeWrnBtnThen(msn:string): Promise<SweetAlertResult<any>>{
    return Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });
  }
  resCargando(msn:string){
    
    Swal.fire({
      allowOutsideClick:false,
      text:msn,
      icon:'info'
    });
    Swal.showLoading();

  };
}
