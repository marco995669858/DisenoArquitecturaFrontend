import { ApiResponse } from './../models/apiResponse';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { EspecialidadDTO, EspecialidadRequest } from '../models/especialidad';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {

  private url = environment.URL_BACKEND + 'especialidad/';

  private http = inject(HttpClient);

  listar(){
    return this.http.get<ApiResponse<EspecialidadDTO[]>>(`${this.url}listar`);
  }

  insertarActualizar(params:EspecialidadRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}insertar/actulizar`, params);
  }

  eliminar(params:EspecialidadRequest){
    params.usuario = localStorage.getItem('usuario')?.toString();
    return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
  }
}
