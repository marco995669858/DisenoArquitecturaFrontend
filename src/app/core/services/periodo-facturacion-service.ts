import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { PeriodoFacturacionDTO, PeriodoFacturacionRequest } from '../models/periodo-facturacion';

@Injectable({
    providedIn: 'root'
})
export class PeriodoFacturacionService {
    private url = environment.URL_BACKEND + 'periodo-facturacion/';
    private http = inject(HttpClient);

    listar() {
        return this.http.get<ApiResponse<PeriodoFacturacionDTO[]>>(`${this.url}listar`);
    }

    // No hay endpoint de eliminar: los periodos se crean solos al primer
    // registro que los referencia (lectura, prorrateo o liquidacion) y solo
    // se pueden editar (por ejemplo, para forzar su estado manualmente).
    insertarActualizar(params: PeriodoFacturacionRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }
}
