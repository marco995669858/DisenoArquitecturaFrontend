import { ApiResponse } from './../models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TipoDocumentoDTO, TipoDocumentoRequest } from '../models/tipoDocumento';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService {

  private url = environment.URL_BACKEND + 'tipo/documento/';

  private http = inject(HttpClient);

  listar(){
    return this.http.get<ApiResponse<TipoDocumentoDTO[]>>(`${this.url}listar`);
  }

  insertarActualizar(params:TipoDocumentoRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}insertar/actulizar`, params);
  }

  eliminar(params:TipoDocumentoRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
  }
}
