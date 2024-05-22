import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EmpleadoModel } from 'src/app/models/empleado.model';
import { UpDownLoadService } from 'src/app/services/updown-load.service';

@Component({
  selector: 'app-empleado-detail',
  templateUrl: './empleado-detail.component.html',
  styleUrls: ['./empleado-detail.component.css']
})
export class EmpleadoDetailComponent implements OnInit {
  
  @Input() empleado:EmpleadoModel = new EmpleadoModel();
  constructor(private http: HttpClient, private loadServ:UpDownLoadService) { }

  ngOnInit(): void {
  }
  subeImagen(){
    const imageUrl = '../../../assets/img/'; // Ruta de la imagen en la carpeta assets
    const imgn = 'aquaman.png';
    this.http.get(imageUrl+imgn, { responseType: 'blob' }).subscribe(blob => {
      const file = new File([blob], imgn, { type: blob.type });
      this.loadServ.postFotoPerfil(localStorage.getItem('token')!, file)
        .subscribe(response => {
          console.log('Imagen subida exitosamente:', response.message);
        }, error => {
          console.error('Error al subir la imagen:', error);
        });
    }, error => {
      console.error('Error al obtener la imagen:', error);
    });
  }
}
