import { EmpleadoModel } from "./empleado.model";
import { TareaModel } from "./tarea.model";

export class SolicitudModel{
  _id : string = "";
  idTarea: string = "";
  idEmpleado: string = "";
  aprobada:boolean = false;
  fechaRegistro : Date = new Date();
};
