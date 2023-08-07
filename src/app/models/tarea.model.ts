
export class TareaModel{
  _id: string = "";
  idTarea: number = 0;
  nombre: string ="";
  departamento: string ="";
  descripcion: string ="";
  importancia: string ="";
  fechainicio: Date =new Date();
  fechafin: Date =new Date();
  terminada: boolean =false;
  numeroTrabajadores: number = 0;
  precioHora: number = 0;
};
