import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { InquilinoDTO, InquilinoRequest } from '../models/inquilino';

@Injectable({
    providedIn: 'root'
})
export class InquilinoService {
    private url = environment.URL_BACKEND + 'inquilino/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<InquilinoDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: InquilinoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: InquilinoRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
