
export class TareaModel{
  _id: string = "";
  idTarea: number = 0;
  nombre: string ="";
  descripcion: string ="";
  importancia: string ="";
  fechainicio: Date =new Date();
  fechafin: Date =new Date();
  terminada: boolean =false;
  numeroTrabajadores: number = 0;
};
