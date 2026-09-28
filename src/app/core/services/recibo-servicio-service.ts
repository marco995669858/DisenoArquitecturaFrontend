import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { ReciboServicioDTO, ReciboServicioRequest } from '../models/recibo-servicio';

@Injectable({
    providedIn: 'root'
})
export class ReciboServicioService {
    private url = environment.URL_BACKEND + 'recibo-servicio/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<ReciboServicioDTO[]>>(`${this.url}listar`);
    }

    insertarActualizar(params: ReciboServicioRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: ReciboServicioRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
