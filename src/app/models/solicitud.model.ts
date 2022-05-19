import { EmpleadoModel } from "./empleado.model";
import { TareaModel } from "./tarea.model";

export class SolicitudModel{
  idSolicitud : string = "";
  tarea: TareaModel = new TareaModel();
  empleado: EmpleadoModel = new EmpleadoModel();
  fechaSolicitud : string = "";
};
