export interface Alerta {
  id: string;
  type: string;
  location: string;
  time: string;
  status: string;
  statusClass: string;
  descripcion?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}
