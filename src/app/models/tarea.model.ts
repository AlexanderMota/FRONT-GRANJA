
export class TareaModel{
  _id: string = "";
  nombre: string ="";
  departamento: string ="";
  descripcion: string ="";
  importancia: string ="";
  fechainicio: Date =new Date();
  fechafin: Date =new Date();
  terminada: boolean =false;
  //numeroTrabajadores: number = 0;// borrar tras sustituir
  plantilla: { rol: string, cantidad: number }[] = [{rol: "",cantidad:0}];
  precioHora: number = 0;
};
