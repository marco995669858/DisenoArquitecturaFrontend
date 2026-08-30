import { ApiResponse } from './../models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { EstadoCitaDTO, EstadoCitaRequest } from '../models/estadoCita';

@Injectable({
  providedIn: 'root',
})
export class EstadoCitaService {

  private url = environment.URL_BACKEND + 'estado/cita/';

  private http = inject(HttpClient);

  listar(){
    return this.http.get<ApiResponse<EstadoCitaDTO[]>>(`${this.url}listar`);
  }

  insertarActualizar(params:EstadoCitaRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}insertar/actulizar`, params);
  }

  eliminar(params:EstadoCitaRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
  }
}
