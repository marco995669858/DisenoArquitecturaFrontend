import { ApiResponse } from './../models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TipoConsultaDTO, TipoConsultaRequest } from '../models/tipoConsulta';

@Injectable({
  providedIn: 'root',
})
export class TipoConsultaService {

  private url = environment.URL_BACKEND + 'tipo/consulta/';

  private http = inject(HttpClient);

  listar(){
    return this.http.get<ApiResponse<TipoConsultaDTO[]>>(`${this.url}listar`);
  }

  insertarActualizar(params:TipoConsultaRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}insertar/actulizar`, params);
  }

  eliminar(params:TipoConsultaRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
  }
}
