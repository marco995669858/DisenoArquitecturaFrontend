import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse';
import { DetalleLiquidacionDTO, DetalleLiquidacionRequest } from '../models/detalle-liquidacion';

@Injectable({
    providedIn: 'root'
})
export class DetalleLiquidacionService {
    private url = environment.URL_BACKEND + 'detalle-liquidacion/';
    private http = inject(HttpClient);

    listarPorLiquidacion(idLiquidacion: number) {
        return this.http.get<ApiResponse<DetalleLiquidacionDTO[]>>(`${this.url}listar`, { params: { idLiquidacion } });
    }

    insertarActualizar(params: DetalleLiquidacionRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}insertar/actualizar`, params);
    }

    eliminar(params: DetalleLiquidacionRequest) {
        return this.http.post<ApiResponse<number>>(`${this.url}eliminar`, params);
    }
}
