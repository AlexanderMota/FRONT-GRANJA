
export class UbicacionModel{
  _id:string="";
  idTarea: string ="";
  titulo: string ="";
  descripcion: string ="";
  fechaRecogida: Date[] = [];
  longitud: number =0.0;
  latitud: number =0.0;
  /*limiteSupDer: number =0.0;
  limiteInfIzq: number =0.0;
  zoom: number =0;*/
  fechaRegistro: Date =new Date();
};

