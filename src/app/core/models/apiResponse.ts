export interface ApiResponse<T> {
  data: T;
  error: boolean;
  mensaje: string;
  paginacion: any;
}
