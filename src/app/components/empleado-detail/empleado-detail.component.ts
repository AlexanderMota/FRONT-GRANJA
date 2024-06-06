import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { UpDownLoadService } from 'src/app/services/updown-load.service';

@Component({
  selector: 'app-empleado-detail',
  templateUrl: './empleado-detail.component.html',
  styleUrls: ['./empleado-detail.component.css']
})
export class EmpleadoDetailComponent implements OnInit {
  imageUrl: SafeUrl | undefined;
/*
  @Output()
  private eventoEmiteFormPerfil = new EventEmitter<boolean>();*/
  @Output()
  private eventoEmiteFormVehi = new EventEmitter<boolean>();

  
  @Input() empleado:EmpleadoModel = new EmpleadoModel();
  constructor(private http: HttpClient, private loadServ:UpDownLoadService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadServ.getFotoPerfil(
      localStorage.getItem("token")!,
      localStorage.getItem("miid")!)
    .subscribe({next:val => {
      console.log(val);
      if((val as ApiResponse).status){
        console.log((val as ApiResponse).message);
      }else if((val as Blob).size < 60){
        console.log("sin foto");
      }else{
        let objectURL = URL.createObjectURL((val as Blob));
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
    },error:err=>console.log(err)});
  }
  /*subeImagen(){
    const imageUrl = '../../../assets/img/';
    const imgn = 'aquaman.png';
    this.http.get(imageUrl+imgn, { responseType: 'blob' }).subscribe({next:blob => {
      const file = new File([blob], imgn, { type: blob.type });
      this.loadServ.postFotoPerfil(localStorage.getItem('token')!, localStorage.getItem('miid')!, file)
        .subscribe({next:response => {
          console.log('Imagen subida exitosamente: ', response.message);
        }, error:err => {
          console.error('Error al subir la imagen: ', err);
        }});
    }, error:err => {
      console.error('Error al obtener la imagen: ', err);
    }});
  }*/

  /*editaPerfil(){
    this.eventoEmiteFormPerfil.emit(true);
  }*/

  agregaVehiculo(){
    this.eventoEmiteFormVehi.emit(true);
  }







  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadImage(file);
    }
  }

  uploadImage(file: File) {
    const token = localStorage.getItem('token');
    const miid = localStorage.getItem('miid');

    if (token && miid) {
      this.loadServ.postFotoPerfil(token, miid, file)
        .subscribe({
          next: (response: ApiResponse) => {
            console.log('Imagen subida exitosamente: ', response.message);
          },
          error: err => {
            console.error('Error al subir la imagen: ', err);
          }
        });
    } else {
      console.error('Token o ID de usuario no encontrado en el almacenamiento local.');
    }
  }
}
